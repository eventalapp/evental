import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent, useSessions } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
import { SessionList } from '../../../../../components/sessions/SessionList';

const SessionsAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: sessions } = useSessions({ eid: String(eid) });
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Sessions</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Sessions</Heading>

							<IconLinkTooltip
								message="Create a session"
								href={`/events/${eid}/admin/sessions/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<SessionList admin sessions={sessions} event={event} />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default SessionsAdminPage;
