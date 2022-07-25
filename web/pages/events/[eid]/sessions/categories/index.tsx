import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent, useIsOrganizer, useSessionCategories } from '@eventalapp/shared/hooks';

import { SessionCategoryList } from '../../../../../components/categories/SessionCategoryList';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';

const SessionCategoriesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: sessionCategories } = useSessionCategories({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
		<NextSeo
			title={`Sessions Categories — ${event.name}`}
			description={`View all of the sessions types for ${event.name}.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/sessions/categories`,
				title: `Session Categories — ${event.name}`,
				description: `View all of the sessions types for ${event.name}.`,
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
					<div>
						<Heading>Session Categories</Heading>

						<SessionCategoryList eid={String(eid)} sessionCategories={sessionCategories} />
					</div>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default SessionCategoriesPage;
