import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent, useEventMessage, useIsOrganizer } from '@eventalapp/shared/hooks';

import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewMessage } from '../../../../components/messages/ViewMessage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { mid, eid } = router.query;
	const { data: message, error: messageError } = useEventMessage({
		eid: String(eid),
		mid: String(mid)
	});
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });

	if (messageError) {
		return <NotFoundPage message="Message not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = message && event && (
		<NextSeo
			title={`${message.title} — ${event.name}`}
			description={`View all of the members of the ${message.title} message.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/messages/${message.slug}`,
				title: `${message.title} — ${event.name}`,
				description: `View all of the members of the ${message.title} message.`,
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
					<EventHeader adminLink={`/messages/${mid}`} eid={String(eid)} />

					<ViewMessage eid={String(eid)} mid={String(mid)} message={message} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewAttendeePage;
