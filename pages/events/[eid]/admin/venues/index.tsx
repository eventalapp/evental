import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../components/AdminPageWrapper';
import { IconLinkTooltip } from '../../../../../components/IconLinkTooltip';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../../components/typography/Heading';
import { VenueList } from '../../../../../components/venues/VenueList';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';

const VenuesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { venues, venuesError } = useVenuesQuery(String(eid));

	return (
		<AdminPageWrapper errors={[venuesError]} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Edit Venues</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<FlexRowBetween>
							<Heading>Venues</Heading>

							<IconLinkTooltip
								message="Create a venue"
								href={`/events/${eid}/admin/venues/create`}
								icon={faSquarePlus}
								color="gray"
							/>
						</FlexRowBetween>

						<VenueList admin eid={String(eid)} venues={venues} />
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default VenuesAdminPage;
