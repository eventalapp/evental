import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useEventMessage } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewMessage } from '../../../../../../components/messages/ViewMessage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { mid, eid } = router.query;
	const {
		data: message,
		error: messageError,
		isLoading: isMessageLoading
	} = useEventMessage({
		eid: String(eid),
		mid: String(mid)
	});

	return (
		<AdminPageWrapper errors={[messageError]} isLoading={isMessageLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Message</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewMessage eid={String(eid)} mid={String(mid)} message={message} admin />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
