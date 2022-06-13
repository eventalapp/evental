import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../components/Footer';
import { LinkButton } from '../../../../../components/form/LinkButton';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useSessionsQuery } from '../../../../../hooks/queries/useSessionsQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { sessionsData, isSessionsLoading } = useSessionsQuery(String(eid));
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

	if (!event || !sessionsData) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Edit Sessions</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl md:text-2xl font-medium">
							Sessions{' '}
							<span className="font-normal text-gray-500">({sessionsData.length || 0})</span>
						</h3>

						<div>
							<Link href={`/events/${eid}/admin/sessions/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<SessionList admin eid={String(eid)} sessions={sessionsData} event={event} user={user} />
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SessionsAdminPage;
