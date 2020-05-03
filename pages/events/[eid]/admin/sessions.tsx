import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { LinkButton } from '../../../../components/form/LinkButton';
import { ssrGetUser } from '../../../../utils/api';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Prisma from '@prisma/client';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { getSessions } from '../../../api/events/[eid]/sessions';
import { Navigation } from '../../../../components/navigation';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { EventSettingsNavigation } from '../../../../components/settings/EventSettingsNavigation';
import { SessionList } from '../../../../components/sessions/SessionList';

type Props = {
	initialSessions: Prisma.EventSession[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialOrganizer: boolean;
};

const SessionsAdminPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialUser, initialSessions, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(
		String(eid),
		initialSessions
	);
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (isSessionsLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Sessions</title>
			</Head>

			<Navigation />

			<Column>
				<EventSettingsNavigation eid={String(eid)} />

				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Sessions</span>

						<div>
							<Link href={`/events/${eid}/admin/sessions/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<SessionList
						eid={String(eid)}
						sessions={sessions}
						isSessionsLoading={isSessionsLoading}
						sessionsError={sessionsError}
						isOrganizer={isOrganizer}
						isOrganizerLoading={isOrganizerLoading}
					/>
				</div>
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
			initialOrganizer,
			initialSessions
		}
	};
};

export default SessionsAdminPage;
