import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { usePage } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditPageForm } from '../../../../../../components/pages/EditPageForm';
import { Heading } from '../../../../../../components/primitives/Heading';

const EditPagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const {
		data: page,
		error: pageError,
		isLoading: isPageLoading
	} = usePage({ eid: String(eid), pid: String(pid) });

	return (
		<AdminPageWrapper errors={[pageError]} eid={String(eid)} isLoading={isPageLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Page</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column>
						<Heading>Edit Page</Heading>

						{page && <EditPageForm eid={String(eid)} pid={String(pid)} page={page} />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditPagePage;
