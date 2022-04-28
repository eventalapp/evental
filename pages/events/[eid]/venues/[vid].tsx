import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import { ViewVenue } from '../../../../components/venues/ViewVenue';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewVenue
					eid={String(eid)}
					vid={String(vid)}
					venue={venue}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					isOrganizerError={isOrganizerError}
					isVenueLoading={isVenueLoading}
					venueError={venueError}
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
