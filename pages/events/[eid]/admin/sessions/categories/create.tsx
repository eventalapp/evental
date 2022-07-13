import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { CreateSessionCategoryForm } from '../../../../../../components/categories/CreateSessionCategoryForm';
import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../../components/primitives/Paragraph';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<AdminPageWrapper eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Create Session Category</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Create Session Category</Heading>

						<Paragraph className="text-gray-600">
							A session category is used to group sessions together. For example a session category
							might be "Keynote", "Workshop", or "Panel".
						</Paragraph>

						<CreateSessionCategoryForm eid={String(eid)} />
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateSessionPage;
