import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionsQuery } from '../../../../../hooks/queries/useSessionsQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { sessionsData } = useSessionsQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));

	const isLoading = isEventLoading || isOrganizerLoading || isUserLoading;

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
				<title>Sessions</title>
			</Head>

			<SidebarWrapper eid={String(eid)}>
				<Column variant="noMargin">
					<FlexRowBetween>
						<Heading>
							Sessions{' '}
							<span className="font-normal text-gray-500">({sessionsData.length || 0})</span>
						</Heading>

						<IconLinkTooltip
							message="Click to create a session"
							side="top"
							href={`/events/${eid}/admin/sessions/create`}
							icon={faSquarePlus}
							className="text-gray-700 hover:text-gray-600"
						/>
					</FlexRowBetween>

					<SessionList admin sessions={sessionsData} event={event} />
				</Column>
			</SidebarWrapper>
		</PageWrapper>
	);
};

export default SessionsAdminPage;
