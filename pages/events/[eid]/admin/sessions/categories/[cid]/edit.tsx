import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../../components/AdminPageWrapper';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { EditSessionCategoryForm } from '../../../../../../../components/sessions/EditSessionCategoryForm';
import { SidebarWrapper } from '../../../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../../../components/typography/Heading';
import { useSessionCategoryQuery } from '../../../../../../../hooks/queries/useSessionCategoryQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, cid } = router.query;
	const { isSessionCategoryLoading, sessionCategory, sessionCategoryError } =
		useSessionCategoryQuery(String(eid), String(cid));

	return (
		<AdminPageWrapper
			eid={String(eid)}
			isLoading={isSessionCategoryLoading}
			errors={[sessionCategoryError]}
		>
			<PageWrapper>
				<Head>
					<title>Edit Session</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Session Category</Heading>

						{sessionCategory && (
							<EditSessionCategoryForm
								eid={String(eid)}
								cid={String(cid)}
								sessionCategory={sessionCategory}
							/>
						)}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditSessionPage;
