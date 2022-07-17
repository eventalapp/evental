import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { EditSessionCategoryForm } from '../../../../../../../components/categories/EditSessionCategoryForm';
import { AdminPageWrapper } from '../../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../../components/primitives/Heading';
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

				<AdminSidebarWrapper eid={String(eid)}>
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
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditSessionPage;