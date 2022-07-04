import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../../components/sessions/SessionList';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useSessionsQuery } from '../../../../../hooks/queries/useSessionsQuery';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { sessionsData } = useSessionsQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Sessions</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>
								Sessions{' '}
								<span className="font-normal text-gray-500">
									({(sessionsData && sessionsData.length) || 0})
								</span>
							</Heading>

							<IconLinkTooltip
								message="Create a session"
								href={`/events/${eid}/admin/sessions/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<SessionList admin sessions={sessionsData} event={event} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default SessionsAdminPage;
