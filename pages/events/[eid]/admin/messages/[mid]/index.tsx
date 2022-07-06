import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/layout/SidebarWrapper';
import { ViewMessage } from '../../../../../../components/messages/ViewMessage';
import { useMessage } from '../../../../../../hooks/queries/useMessage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { mid, eid } = router.query;
	const { message, messageError, isMessageLoading } = useMessage(String(eid), String(mid));

	return (
		<AdminPageWrapper errors={[messageError]} isLoading={isMessageLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Message</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewMessage eid={String(eid)} mid={String(mid)} message={message} admin />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewAttendeePage;
