import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewSession } from '../../../../../components/sessions/ViewSession';
import Column from '../../../../../components/layout/Column';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import React from 'react';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../api/events/[eid]/organizer';

import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../../utils/api';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
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

type Props = {
	initialSession: SessionWithVenue | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialSession, initialOrganizer, initialUser, initialRoles, initialEvent } = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser(initialUser);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { sessionAttendeeQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id)
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(String(eid), String(sid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);

	if (isOrganizerLoading || isSessionLoading || isRolesLoading || isEventLoading) {
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

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewSession
					sessionAttendeesQuery={sessionAttendeesQuery}
					sessionAttendeeQuery={sessionAttendeeQuery}
					session={session}
					isSessionLoading={isSessionLoading}
					sessionError={sessionError}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					eid={String(eid)}
					sid={String(sid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { sid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialOrganizer,
			initialEvent,
			initialRoles
		}
	};
};

export default ViewSessionPage;
