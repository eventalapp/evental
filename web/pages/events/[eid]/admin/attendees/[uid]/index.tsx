import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAttendee } from '@eventalapp/shared/hooks';

import { ViewAttendee } from '../../../../../../components/attendees/ViewAttendee';
import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { uid, eid } = router.query;
	const {
		data: attendee,
		error: attendeeError,
		isLoading: isAttendeeLoading
	} = useAttendee({
		eid: String(eid),
		uid: String(uid)
	});

	return (
		<AdminPageWrapper errors={[attendeeError]} isLoading={isAttendeeLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Attendee</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewAttendee admin attendee={attendee} eid={String(eid)} uid={String(uid)} />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
