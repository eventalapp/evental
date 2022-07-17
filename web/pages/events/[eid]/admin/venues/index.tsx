import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { IconLinkTooltip } from '../../../../../components/primitives/IconLinkTooltip';
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

				<AdminSidebarWrapper eid={String(eid)}>
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
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default VenuesAdminPage;
