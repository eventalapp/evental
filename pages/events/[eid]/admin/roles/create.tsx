import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/layout/SidebarWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';
import { CreateRoleForm } from '../../../../../components/roles/CreateRoleForm';

const CreateRolePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

	return (
		<AdminPageWrapper eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Create Role</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Create Role</Heading>

						<Paragraph className="text-gray-600">
							Roles are used to categorize your attendees. For example, you might have a role called
							"Speaker", which would be used to group speakers.
						</Paragraph>

						<CreateRoleForm eid={String(eid)} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreateRolePage;
