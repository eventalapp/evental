import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import React from 'react';
import { useRoleQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getRole } from '../../../api/events/[eid]/roles/[rid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { EventNavigation } from '../../../../components/events/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { getEvent } from '../../../api/events/[eid]';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { getRoles } from '../../../api/events/[eid]/roles';
import { EventHeader } from '../../../../components/events/EventHeader';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { capitalizeFirstLetter } from '../../../../utils/string';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { useAttendeesByRoleQuery } from '../../../../hooks/queries/useAttendeesByRoleQuery';
import { getAttendeesByRole } from '../../../api/events/[eid]/attendees';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../components/error/PrivatePage';

type Props = {
	initialRole: Prisma.EventRole | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialAttendees: AttendeeWithUser[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const {
		initialAttendees,
		initialOrganizer,
		initialRole,
		initialUser,
		initialEvent,
		initialRoles,
		initialIsAttendeeByUserId,
		initialPages
	} = props;
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, isRoleLoading, roleError } = useRoleQuery(String(eid), String(rid), initialRole);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid), {
		initialData: initialAttendees
	});
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isOrganizerLoading ||
		isRoleLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isAttendeesLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!role || !attendeesData) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleError || eventError || rolesError || attendeeError) {
		return <ViewErrorPage errors={[roleError, rolesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`${role.name} — ${event.name}`}
				description={`View all of the members of the ${role.name} role.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/roles/${role.slug}`,
					title: `${role.name} — ${event.name}`,
					description: `View all of the members of the ${role.name} role.`,
					images: [
						{
							url: `https://cdn.evental.app${event.image}`,
							width: 300,
							height: 300,
							alt: `${event.name} Logo Alt`,
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				{event && (
					<EventHeader
						adminLink={`/roles/${rid}`}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">
						{capitalizeFirstLetter(role.name.toLowerCase())}s{' '}
						<span className="font-normal text-gray-500">({attendeesData?.length || 0})</span>
					</h3>
				</FlexRowBetween>

				{attendeesData?.length === 0 ? (
					<p>No {role.name.toLowerCase()}s found.</p>
				) : (
					<AttendeeList eid={String(eid)} attendees={attendeesData} />
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, rid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialRole,
			initialAttendees,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendeeByUserId,
			initialPages
		}
	};
};

export default ViewAttendeePage;
