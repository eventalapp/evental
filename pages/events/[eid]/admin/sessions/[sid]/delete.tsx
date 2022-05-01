import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeleteSessionForm } from '../../../../../../components/sessions/DeleteSessionForm';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useDeleteSessionMutation } from '../../../../../../hooks/mutations/useDeleteSessionMutation';
import { getSession } from '../../../../../api/events/[eid]/sessions/[sid]';
import type Prisma from '@prisma/client';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialSession: Prisma.EventSession | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteSessionPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialSession, initialUser } = props;
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { deleteSessionMutation } = useDeleteSessionMutation(String(eid), String(sid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found" />;
	}

	if (isSessionLoading) {
		return <LoadingPage />;
	}

	if (sessionError) {
		return <ViewErrorPage errors={[sessionError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Session</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
					You are about to delete an session ("{session.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Session</h1>

				<DeleteSessionForm
					session={session}
					isSessionLoading={isSessionLoading}
					sessionError={sessionError}
					deleteSessionMutation={deleteSessionMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, sid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialSession = (await getSession(String(eid), String(sid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialSession
		}
	};
};

export default DeleteSessionPage;
