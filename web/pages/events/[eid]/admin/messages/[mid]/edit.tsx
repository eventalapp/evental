import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useEventMessage } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditMessageForm } from '../../../../../../components/messages/EditMessageForm';
import { Heading } from '../../../../../../components/primitives/Heading';

const EditMessagePage: NextPage = () => {
	const router = useRouter();
	const { eid, mid } = router.query;
	const {
		data: message,
		error: messageError,
		isLoading: isMessageLoading
	} = useEventMessage({
		eid: String(eid),
		mid: String(mid)
	});
	return (
		<AdminPageWrapper errors={[messageError]} eid={String(eid)} isLoading={isMessageLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Message</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Message</Heading>

						{/*TODO: Skeletonize*/}

						{message && <EditMessageForm eid={String(eid)} mid={String(mid)} message={message} />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditMessagePage;
