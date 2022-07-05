import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import { Heading } from '../../../../../components/primitives/Heading';

const MessagePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<AdminPageWrapper eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Messages</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column>
						<Heading>Messages</Heading>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default MessagePage;
