import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewSession } from '../../../../../components/sessions/ViewSession';
import Column from '../../../../../components/layout/Column';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';
import { useSessionAttendeeQuery } from '../../../../../hooks/queries/useSessionAttendeeQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useSessionAttendeesQuery } from '../../../../../hooks/queries/useSessionAttendeesQuery';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { EventNavigation } from '../../../../../components/events/navigation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import Prisma from '@prisma/client';
import { getSessionAttendees } from '../../../../api/events/[eid]/sessions/[sid]/attendees';
import { getSessionAttendee } from '../../../../api/events/[eid]/sessions/[sid]/attendees/[uid]';
import { usePagesQuery } from '../../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../../api/events/[eid]/pages';

type Props = {
	initialSession: SessionWithVenue | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialSessionAttendees: AttendeeWithUser[] | undefined;
	initialSessionAttendee: AttendeeWithUser | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const {
		initialSession,
		initialUser,
		initialRoles,
		initialEvent,
		initialSessionAttendees,
		initialSessionAttendee,
		initialPages
	} = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser(initialUser);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { sessionAttendeeQuery: isAttendingSessionQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id),
		initialSessionAttendee
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(
		String(eid),
		String(sid),
		initialSessionAttendees
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	if (isSessionLoading || isRolesLoading || isEventLoading || isPagesLoading) {
		return <LoadingPage />;
	}

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (sessionError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Session</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<ViewSession
					attendees={sessionAttendeesQuery.data}
					isAttending={Boolean(isAttendingSessionQuery.data)}
					session={session}
					eid={String(eid)}
					sid={String(sid)}
					event={event}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { sid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionAttendees =
		(await getSessionAttendees(String(eid), String(sid))) ?? undefined;
	const initialSessionAttendee =
		(await getSessionAttendee(String(eid), String(sid), String(initialUser?.id))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialEvent,
			initialRoles,
			initialSessionAttendees,
			initialSessionAttendee,
			initialPages
		}
	};
};

export default ViewSessionPage;
