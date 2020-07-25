import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent, useSessionsByVenue, useUser, useVenue } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewVenue } from '../../../../../../components/venues/ViewVenue';

const ViewVenuePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const {
		data: venue,
		error: venueError,
		isLoading: isVenueLoading
	} = useVenue({ eid: String(eid), vid: String(vid) });
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const { data: user, isLoading: isUserLoading } = useUser();
	const { data: sessionsByVenue } = useSessionsByVenue({ eid: String(eid), vid: String(vid) });

	return (
		<AdminPageWrapper
			errors={[eventError, venueError]}
			isLoading={isEventLoading || isUserLoading || isVenueLoading}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Venue</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewVenue
							eid={String(eid)}
							vid={String(vid)}
							event={event}
							sessions={sessionsByVenue}
							user={user}
							venue={venue}
							admin
						/>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewVenuePage;
