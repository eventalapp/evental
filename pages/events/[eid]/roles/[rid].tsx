import Prisma from '@prisma/client';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { Footer } from '../../../../components/Footer';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../components/roles/ViewRole';
import { useAttendeesByRoleQuery } from '../../../../hooks/queries/useAttendeesByRoleQuery';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useRoleQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getEvent } from '../../../api/events/[eid]';
import { getIsAttendee } from '../../../api/events/[eid]/attendee';
import { getAttendeesByRole } from '../../../api/events/[eid]/attendees';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getPages } from '../../../api/events/[eid]/pages';
import { getRoles } from '../../../api/events/[eid]/roles';
import { getRole } from '../../../api/events/[eid]/roles/[rid]';

type Props = {
	initialRole: Prisma.EventRole | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialAttendees: AttendeeWithUser[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendee: boolean;
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
		initialIsAttendee,
		initialPages
	} = props;
	const router = useRouter();
	const { rid, eid } = router.query;

	const { role, isRoleLoading, roleError } = useRoleQuery(String(eid), String(rid), initialRole);
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { isAttendee, isAttendeeLoading } = useIsAttendeeQuery(String(eid), initialIsAttendee);
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

	if (roleError || eventError || rolesError) {
		return <ViewErrorPage errors={[roleError, rolesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
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
						user={user}
					/>
				)}

				<ViewRole attendees={attendeesData} eid={String(eid)} rid={String(rid)} role={role} />
			</Column>

			<Footer color={event.color} />
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
	const initialIsAttendee =
		(await getIsAttendee({ eid: String(eid), userId: String(initialUser?.id) })) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialRole,
			initialAttendees,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendee,
			initialPages
		}
	};
};

export default ViewAttendeePage;
