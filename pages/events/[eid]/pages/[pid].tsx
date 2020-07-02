import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewPage } from '../../../../components/pages/ViewPage';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { usePageQuery } from '../../../../hooks/queries/usePageQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { pid, eid } = router.query;
	const { page, pageError } = usePageQuery(String(eid), String(pid));
	const { event, eventError } = useEventQuery(String(eid));

	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (pageError) {
		return <NotFoundPage message="Page not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && page && (
				<NextSeo
					title={`${page.name} — ${event.name}`}
					description={`View the ${page.name} page for ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/pages/${page.slug}`,
						title: `${page.name} — ${event.name}`,
						description: `View the ${page.name} page for ${event.name}.`,
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
				<EventHeader adminLink={`/pages/${pid}`} eid={String(eid)} />

				<ViewPage page={page} eid={String(eid)} pid={String(pid)} />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
