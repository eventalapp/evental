import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/layout/SidebarWrapper';
import { EditMessageForm } from '../../../../../../components/messages/EditMessageForm';
import { Heading } from '../../../../../../components/primitives/Heading';
import { useMessage } from '../../../../../../hooks/queries/useMessage';

const EditMessagePage: NextPage = () => {
	const router = useRouter();
	const { eid, mid } = router.query;
	const { messageError, message, isMessageLoading } = useMessage(String(eid), String(mid));

	return (
		<AdminPageWrapper errors={[messageError]} eid={String(eid)} isLoading={isMessageLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Message</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Message</Heading>

						{/*TODO: Skeletonize*/}

						{message && <EditMessageForm eid={String(eid)} mid={String(mid)} message={message} />}
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditMessagePage;
