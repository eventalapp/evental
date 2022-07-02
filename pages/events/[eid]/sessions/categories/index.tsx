import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SessionCategoryList } from '../../../../../components/sessions/SessionCategoryList';
import { Heading } from '../../../../../components/typography/Heading';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionCategoriesQuery } from '../../../../../hooks/queries/useSessionCategoriesQuery';

const SessionCategoriesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, eventError } = useEventQuery(String(eid));
	const { sessionCategories } = useSessionCategoriesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && (
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
			)}

			<EventNavigation eid={String(eid)} />

			<Column>
				<div>
					<Heading>Session Categories</Heading>

					<SessionCategoryList eid={String(eid)} sessionCategories={sessionCategories} />
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default SessionCategoriesPage;