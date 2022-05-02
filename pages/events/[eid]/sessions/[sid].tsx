import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewSession } from '../../../../components/sessions/ViewSession';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useSessionQuery } from '../../../../hooks/queries/useSessionQuery';
import React from 'react';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import type Prisma from '@prisma/client';
import { getSession } from '../../../api/events/[eid]/sessions/[sid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';

type Props = {
	initialSession: Prisma.EventSession | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ViewSessionPage: NextPage<Props> = (props) => {
	const { initialSession, initialOrganizer } = props;
	const router = useRouter();
	const { sid, eid } = router.query;
	const { session, isSessionLoading, sessionError } = useSessionQuery(
		String(eid),
		String(sid),
		initialSession
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

	if (!initialSession || !session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (isOrganizerLoading || isSessionLoading) {
		return <LoadingPage />;
	}

	if (sessionError) {
		return <ViewErrorPage errors={[sessionError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Session: {sid}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewSession
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

	return {
		props: {
			initialUser,
			initialSession,
			initialOrganizer
		}
	};
};

export default ViewSessionPage;
