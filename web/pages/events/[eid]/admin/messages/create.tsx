import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useRoles } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SendMessageForm } from '../../../../../components/messages/SendMessageForm';
import { Heading } from '../../../../../components/primitives/Heading';
import { Paragraph } from '../../../../../components/primitives/Paragraph';

const CreatePagePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: roles,
		isLoading: isRolesLoading,
		error: rolesError
	} = useRoles({ eid: String(eid) });

	return (
		<AdminPageWrapper eid={String(eid)} isLoading={isRolesLoading} errors={[rolesError]}>
			<PageWrapper>
				<Head>
					<title>Send A Message</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading className="mb-3">Send A Message</Heading>

						<Paragraph className="text-gray-600">
							Send a message to all of your attendees or members of a role.
						</Paragraph>

						{roles && <SendMessageForm eid={String(eid)} roles={roles} />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default CreatePagePage;
