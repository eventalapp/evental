import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useEvent, useEventMessages, useIsOrganizer } from '@eventalapp/shared/hooks';

import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { MessageList } from '../../../../components/messages/MessageList';
import { Heading } from '../../../../components/primitives/Heading';

const MessagesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: messages } = useEventMessages({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
		<NextSeo
			title={`Messages — ${event.name}`}
			description={`View all of the messages at ${event.name}.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/messages`,
				title: `Messages — ${event.name}`,
				description: `View all of the messages at ${event.name}.`,
				images: [
					{
						url: `https://cdn.evental.app${event.image}`,
						width: 300,
						height: 300,
						alt: `${event.name} Logo Alt`,
						type: 'image/jpeg'
					}
				]
			}}
		/>
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={'/messages'} eid={String(eid)} />

					<Heading variant="xl" level={2} className="mb-3">
						{event && messages ? 'Messages' : <Skeleton className="w-48" />}
					</Heading>

					{messages && <MessageList eid={String(eid)} messages={messages} />}
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default MessagesPage;
