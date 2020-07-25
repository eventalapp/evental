import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useEventMessages } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { MessageList } from '../../../../../components/messages/MessageList';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';

const MessagePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: messages,
		error: messagesError,
		isLoading: isMessagesLoading
	} = useEventMessages({ eid: String(eid) });

	return (
		<AdminPageWrapper eid={String(eid)} isLoading={isMessagesLoading} errors={[messagesError]}>
			<PageWrapper>
				<Head>
					<title>Messages</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Messages</Heading>

							<IconLinkTooltip
								href={`/events/${eid}/admin/messages/create`}
								message="Send a message"
								icon={faPaperPlane}
								color="gray"
							/>
						</FlexRowBetween>

						{messages && <MessageList eid={String(eid)} messages={messages} admin />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default MessagePage;
