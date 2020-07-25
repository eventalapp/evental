import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent, useIsOrganizer, usePage } from '@eventalapp/shared/hooks';

import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewPage } from '../../../../components/pages/ViewPage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { pid, eid } = router.query;
	const { data: page, error: pageError } = usePage({ eid: String(eid), pid: String(pid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });

	if (pageError) {
		return <NotFoundPage message="Page not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && page && (
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
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={`/pages/${pid}`} eid={String(eid)} />

					<ViewPage page={page} eid={String(eid)} pid={String(pid)} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default ViewAttendeePage;
