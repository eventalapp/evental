import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import { Navigation } from '../../../../../components/navigation';
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

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialSession: SessionWithVenue | undefined;
};

const SessionRegisterPage: NextPage<Props> = (props) => {
	const { initialUser, initialSession } = props;
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

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (isSessionLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Session signup</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="text-3xl font-bold">Register for {session.name}</h1>

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

	return {
		props: {
			initialUser,
			initialSession
		}
	};
};

export default SessionRegisterPage;
