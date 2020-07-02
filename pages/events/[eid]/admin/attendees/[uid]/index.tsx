import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import { ViewAttendee } from '../../../../../../components/attendees/ViewAttendee';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { uid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));

	return (
		<AdminPageWrapper errors={[attendeeError]} isLoading={isAttendeeLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Attendee</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewAttendee admin attendee={attendee} eid={String(eid)} uid={String(uid)} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
