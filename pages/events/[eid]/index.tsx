import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import PageWrapper from '../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getSessions, SessionWithVenue } from '../../api/events/[eid]/sessions';
import { getRoles } from '../../api/events/[eid]/roles';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import React from 'react';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../utils/api';
import { useUser } from '../../../hooks/queries/useUser';
import { AttendeeWithUser, PasswordlessUser } from '../../../utils/stripUserPassword';
import { getAttendee } from '../../api/events/[eid]/attendees/[uid]';
import { useAttendeeQuery } from '../../../hooks/queries/useAttendeeQuery';
import { EventNavigation } from '../../../components/events/navigation';
import { EventHeader } from '../../../components/events/EventHeader';
import { SessionList } from '../../../components/sessions/SessionList';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';
import { getVenues } from '../../api/events/[eid]/venues';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialSessions: SessionWithVenue[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialVenues: Prisma.EventVenue[] | undefined;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles,
		initialSessions,
		initialIsAttendeeByUserId,
		initialVenues
	} = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(
		String(eid),
		initialSessions
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);
	const { venues, venuesError, isVenuesLoading } = useVenuesQuery(String(eid), initialVenues);

	if (
		isEventLoading ||
		isOrganizerLoading ||
		isSessionsLoading ||
		isRolesLoading ||
		isAttendeeLoading ||
		isVenuesLoading
	) {
		return <LoadingPage />;
	}

	if (rolesError || eventError || sessionsError || attendeeError || venuesError) {
		return (
			<ViewErrorPage errors={[rolesError, eventError, sessionsError, attendeeError, venuesError]} />
		);
	}

	if (!event || !sessions || !roles) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>{event && event.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						eid={String(eid)}
						event={event}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<div className="grid grid-cols-12 gap-4">
					<div className="md:col-span-9 col-span-12">
						<h1 className="text-2xl md:text-3xl font-bold leading-tight">Sessions</h1>
						<SessionList
							sessions={sessions}
							eid={String(eid)}
							sessionsError={sessionsError}
							isSessionsLoading={isSessionsLoading}
						/>
					</div>
					<div className="md:col-span-3 col-span-12">
						<span className="block font-medium border-b border-gray-200">Timezone</span>
						<span className="block font-medium border-b border-gray-200">Filter by Venue</span>
						<ul>{venues && venues.map((venue) => <p key={venue.id}>{venue.name}</p>)}</ul>
						<span className="block font-medium border-b border-gray-200">Filter by Date</span>
						<span className="block font-medium border-b border-gray-200">Filter by Type</span>
					</div>
				</div>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialEvent,
			initialUser,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialSessions,
			initialVenues
		}
	};
};

export default ViewEventPage;
