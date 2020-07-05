import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/layout/SidebarWrapper';
import { EditPageForm } from '../../../../../../components/pages/EditPageForm';
import { Heading } from '../../../../../../components/primitives/Heading';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';

const EditPagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));

	return (
		<AdminPageWrapper errors={[pageError]} eid={String(eid)} isLoading={isPageLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Page</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column>
						<Heading>Edit Page</Heading>

						{page && <EditPageForm eid={String(eid)} pid={String(pid)} page={page} />}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditPagePage;
