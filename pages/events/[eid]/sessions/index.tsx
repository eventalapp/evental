import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { SessionList } from '../../../../components/sessions/SessionList';
import Column from '../../../../components/layout/Column';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React, { useState } from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getSessions, PaginatedSessionsWithVenue } from '../../../api/events/[eid]/sessions';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { EventNavigation } from '../../../../components/events/navigation';
import { EventHeader } from '../../../../components/events/EventHeader';
import { getEvent } from '../../../api/events/[eid]';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { getRoles } from '../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { Pagination } from '../../../../components/Pagination';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';

type Props = {
	initialSessions: PaginatedSessionsWithVenue | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;

	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const {
		initialSessions,
		initialOrganizer,
		initialEvent,
		initialRoles,
		initialIsAttendeeByUserId,
		initialUser,
		initialPages
	} = props;
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { eid } = router.query;
	const { sessionsData, isSessionsLoading, sessionsError } = useSessionsQuery(String(eid), {
		initialData: initialSessions,
		page
	});
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isSessionsLoading ||
		isOrganizerLoading ||
		isAttendeeLoading ||
		isRolesLoading ||
		isEventLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (!sessionsData?.sessions) {
		return <NotFoundPage message="No sessions not found." />;
	}

	if (sessionsError || rolesError || eventError || attendeeError) {
		return <ViewErrorPage errors={[sessionsError, rolesError, eventError, attendeeError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`Sessions — ${event.name}`}
				description={`View all of the sessions for ${event.name}.`}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/sessions`,
					title: `Sessions — ${event.name}`,
					description: `View all of the sessions for ${event.name}.`,
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
						adminLink={'/sessions'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">
					Sessions{' '}
					{sessionsData?.pagination?.total > 0 && (
						<span className="font-normal text-gray-500">
							({sessionsData?.pagination?.from || 0}/{sessionsData?.pagination?.total || 0})
						</span>
					)}
				</h3>

				<SessionList sessions={sessionsData?.sessions} eid={String(eid)} event={event} />

				{sessionsData.pagination.pageCount > 1 && (
					<Pagination page={page} pageCount={sessionsData.pagination.pageCount} setPage={setPage} />
				)}
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessions,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendeeByUserId,
			initialPages
		}
	};
};

export default SessionsPage;
