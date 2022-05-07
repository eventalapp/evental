import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionList } from '../../../../components/sessions/SessionList';
import Column from '../../../../components/layout/Column';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getSessions, SessionWithVenue } from '../../../api/events/[eid]/sessions';
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

type Props = {
	initialSessions: SessionWithVenue[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const {
		initialSessions,
		initialOrganizer,
		initialEvent,
		initialRoles,
		initialIsAttendeeByUserId,
		initialUser
	} = props;
	const router = useRouter();
	const { eid } = router.query;
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(
		String(eid),
		initialSessions
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);

	if (
		isSessionsLoading ||
		isOrganizerLoading ||
		isAttendeeLoading ||
		isRolesLoading ||
		isEventLoading
	) {
		return <LoadingPage />;
	}

	if (!sessions) {
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
			<Head>
				<title>All Sessions</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">Sessions</h3>

				<SessionList sessions={sessions} eid={String(eid)} />
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

	return {
		props: {
			initialUser,
			initialSessions,
			initialOrganizer,
			initialEvent,
			initialRoles,
			initialIsAttendeeByUserId
		}
	};
};

export default SessionsPage;
