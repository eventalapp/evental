import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/layout/Column';
import { ViewEvent } from '../../../components/events/ViewEvent';
import { Navigation } from '../../../components/navigation';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import PageWrapper from '../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { getEvent } from '../../api/events/[eid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getSessions } from '../../api/events/[eid]/sessions';
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

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialSessions: Prisma.EventSession[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles,
		initialSessions,
		initialIsAttendeeByUserId
	} = props;
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(
		String(eid),
		initialSessions
	);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { attendee, attendeeError, isAttendeeLoading } = useAttendeeQuery(
		String(eid),
		String(user?.id),
		initialIsAttendeeByUserId
	);

	if (rolesError || eventError || sessionsError) {
		return <ViewErrorPage errors={[rolesError, eventError, sessionsError]} />;
	}

	if (!initialRoles || !initialSessions || !initialEvent || !event || !sessions || !roles) {
		return <NotFoundPage message="Event not found." />;
	}

	if (
		rolesError ||
		isEventLoading ||
		isOrganizerLoading ||
		isSessionsLoading ||
		isRolesLoading ||
		isAttendeeLoading
	) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>{event && event.name}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewEvent
					eid={String(eid)}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					sessions={sessions}
					isSessionsLoading={isSessionsLoading}
					sessionsError={sessionsError}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
					attendee={attendee}
					isAttendeeLoading={isAttendeeLoading}
					attendeeError={attendeeError}
				/>
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
			initialSessions
		}
	};
};

export default ViewEventPage;
