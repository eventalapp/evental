import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { PasswordlessUser } from '../../../../../utils/stripUserPassword';
import { ssrGetUser } from '../../../../../utils/api';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { CreateSessionAttendeeForm } from '../../../../../components/sessions/CreateSessionAttendeeForm';
import { useCreateSessionAttendeeMutation } from '../../../../../hooks/mutations/useCreateSessionAttendeeMutation';
import { getSession } from '../../../../api/events/[eid]/sessions/[sid]';
import { SessionWithVenue } from '../../../../api/events/[eid]/sessions';
import { EventNavigation } from '../../../../../components/events/navigation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import Prisma from '@prisma/client';
import { getEvent } from '../../../../api/events/[eid]';
import { getRoles } from '../../../../api/events/[eid]/roles';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialSession: SessionWithVenue | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const SessionRegisterPage: NextPage<Props> = (props) => {
	const { initialUser, initialSession, initialEvent, initialRoles } = props;
	const router = useRouter();
	const { eid, sid } = router.query;
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		String(eid),
		String(sid)
	);
	const { user } = useUser(initialUser);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);

	if (isSessionLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (sessionError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionError, rolesError, eventError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Session signup</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h1 className="text-2xl md:text-3xl font-bold">Register for {session.name}</h1>

				<p className="text-gray-700 mt-2">
					To attend this session, please click the register button below.
				</p>

				<CreateSessionAttendeeForm
					session={session}
					sessionError={sessionError}
					isSessionLoading={isSessionLoading}
					createSessionAttendeeMutation={createSessionAttendeeMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, sid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSession,
			initialEvent,
			initialRoles
		}
	};
};

export default SessionRegisterPage;
