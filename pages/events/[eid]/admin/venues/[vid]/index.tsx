import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../components/layout/SidebarWrapper';
import { ViewVenue } from '../../../../../../components/venues/ViewVenue';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useSessionsByVenueQuery } from '../../../../../../hooks/queries/useSessionsByVenueQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const ViewVenuePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading } = useVenueQuery(String(eid), String(vid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { sessionsByVenueData } = useSessionsByVenueQuery(String(eid), String(vid));

	return (
		<AdminPageWrapper
			errors={[eventError]}
			isLoading={isEventLoading || isUserLoading || isVenueLoading}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Venue</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewVenue
							eid={String(eid)}
							vid={String(vid)}
							event={event}
							sessions={sessionsByVenueData}
							user={user}
							venue={venue}
							admin
						/>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewVenuePage;
