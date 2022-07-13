import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewPage } from '../../../../../../components/pages/ViewPage';
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

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewPage admin page={page} eid={String(eid)} pid={String(pid)} />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewPagePage;
