import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import React, { useState } from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getAttendees, PaginatedAttendeesWithUser } from '../../../api/events/[eid]/attendees';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { EventNavigation } from '../../../../components/events/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { getEvent } from '../../../api/events/[eid]';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { getSessions } from '../../../api/events/[eid]/sessions';
import { getRoles } from '../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { EventHeader } from '../../../../components/events/EventHeader';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { Pagination } from '../../../../components/Pagination';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../components/error/PrivatePage';

type Props = {
	initialAttendees: PaginatedAttendeesWithUser | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const {
		initialAttendees,
		initialIsAttendeeByUserId,
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles,
		initialPages
	} = props;
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { uid, eid } = router.query;
	const { attendeesData, attendeesError, isAttendeesLoading } = useAttendeesQuery(String(eid), {
		initialData: initialAttendees,
		page
	});
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isAttendeesLoading ||
		isRolesLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isOrganizerLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!attendeesData?.attendees) {
		return <NotFoundPage message="No attendees not found." />;
	}

	if (attendeesError || attendeeError || eventError || rolesError) {
		return <ViewErrorPage errors={[attendeesError, attendeeError, eventError, rolesError]} />;
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
				title={`Attendees — ${event.name}`}
				description={`View all of the attendees for ${event.name}.`}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/attendees`,
					title: `Attendees — ${event.name}`,
					description: `View all of the attendees for ${event.name}.`,
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
						adminLink={'/attendees'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">
					Attendees{' '}
					{attendeesData?.pagination?.total > 0 && (
						<span className="font-normal text-gray-500">
							({attendeesData?.pagination?.from || 0}/{attendeesData?.pagination?.total || 0})
						</span>
					)}
				</h3>

				<AttendeeList attendees={attendeesData.attendees} eid={String(eid)} />

				{attendeesData.pagination.pageCount > 1 && (
					<Pagination
						page={page}
						pageCount={attendeesData.pagination.pageCount}
						setPage={setPage}
					/>
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendees = (await getAttendees(String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialAttendees,
			initialEvent,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialSessions,
			initialPages
		}
	};
};

export default ViewAttendeePage;
