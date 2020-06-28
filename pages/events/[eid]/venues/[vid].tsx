import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { ViewVenue } from '../../../../components/venues/ViewVenue';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionsByVenueQuery } from '../../../../hooks/queries/useSessionsByVenueQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, venueError } = useVenueQuery(String(eid), String(vid));
	const { event, eventError } = useEventQuery(String(eid));
	const { user } = useUser();
	const { sessionsByVenueData } = useSessionsByVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (!venueError) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{venue && event && (
				<NextSeo
					title={`${venue.name} — ${event.name}`}
					description={`View all of the sessions occurring at ${venue.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/venues/${venue.slug}`,
						title: `${venue.name} — ${event.name}`,
						description: `View all of the sessions occurring at ${venue.name}.`,
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
				<ViewVenue
					eid={String(eid)}
					vid={String(vid)}
					event={event}
					sessions={sessionsByVenueData}
					user={user}
					venue={venue}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
