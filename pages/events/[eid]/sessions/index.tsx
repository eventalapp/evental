import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SessionList } from '../../../../components/sessions/SessionList';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { groupByDate } from '../../../../utils/groupByDate';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

import { getIsOrganizer } from '../../../api/events/[eid]/organizer';

import type Prisma from '@prisma/client';
import { getSessions } from '../../../api/events/[eid]/sessions';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser, ssrGetUser } from '../../../../utils/api';

type Props = {
	initialSessions: Prisma.EventSession[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const { initialSessions, initialOrganizer } = props;
	const router = useRouter();
	const { eid } = router.query;
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(
		String(eid),
		initialSessions
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialSessions || !sessions) {
		return <NotFoundPage message="No sessions not found." />;
	}

	if (isSessionsLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (sessionsError || isOrganizerError) {
		return <ViewErrorPage errors={[sessionsError, isOrganizerError]} />;
	}

	if (sessions) {
		groupByDate(sessions);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Sessions</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Sessions</h1>

					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/sessions/create`} passHref>
							<LinkButton>Create Session</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<SessionList
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					sessions={sessions}
					eid={String(eid)}
					sessionsError={sessionsError}
					isSessionsLoading={isSessionsLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialSessions,
			initialOrganizer
		}
	};
};

export default SessionsPage;
