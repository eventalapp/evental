import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewPage } from '../../../../../../components/pages/ViewPage';
import { SidebarWrapper } from '../../../../../../components/sidebar/SidebarWrapper';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';

const ViewPagePage: NextPage = () => {
	const router = useRouter();
	const { pid, eid } = router.query;
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));

	return (
		<AdminPageWrapper errors={[pageError]} isLoading={isPageLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Viewing Page</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewPage admin page={page} eid={String(eid)} pid={String(pid)} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewPagePage;
