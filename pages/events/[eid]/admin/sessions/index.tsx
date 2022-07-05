import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import { Button } from '../../../../../components/primitives/Button';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useSessionsQuery } from '../../../../../hooks/queries/useSessionsQuery';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { sessionsData } = useSessionsQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const [showPastSessions, setShowPastSessions] = useState(false);

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Sessions</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading className="flex flex-row">
								Sessions
								<Button
									className="ml-3"
									onClick={() => {
										setShowPastSessions(!showPastSessions);
									}}
								>
									{showPastSessions ? 'Hide' : 'Show'} Past Sessions
								</Button>
							</Heading>

							<IconLinkTooltip
								message="Create a session"
								href={`/events/${eid}/admin/sessions/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<SessionList
							admin
							sessions={sessionsData}
							event={event}
							showPastSessions={showPastSessions}
						/>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default SessionsAdminPage;
