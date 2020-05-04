import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LinkButton } from '../../../../components/form/LinkButton';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { AdminSessionList } from '../../../../components/sessions/AdminSessionList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { sessions, isSessionsLoading, sessionsError } = useSessionsQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isSessionsLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isOrganizerLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Sessions</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<span className="text-3xl font-bold">Sessions</span>

						<div>
							<Link href={`/events/${eid}/admin/sessions/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<AdminSessionList
						eid={String(eid)}
						sessions={sessions}
						isSessionsLoading={isSessionsLoading}
						sessionsError={sessionsError}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default SessionsAdminPage;
