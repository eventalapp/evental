import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useVenue } from '@eventalapp/shared/hooks';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../../components/primitives/Heading';
import { EditVenueForm } from '../../../../../../components/venues/EditVenueForm';

const EditVenuePage: NextPage = () => {
	const router = useRouter();
	const { eid, vid } = router.query;
	const {
		data: venue,
		error: venueError,
		isLoading: isVenueLoading
	} = useVenue({ eid: String(eid), vid: String(vid) });

	return (
		<AdminPageWrapper eid={String(eid)} errors={[venueError]} isLoading={isVenueLoading}>
			<PageWrapper>
				<Head>
					<title>Edit Venue</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Edit Venue</Heading>

						{venue && <EditVenueForm eid={String(eid)} vid={String(vid)} venue={venue} />}
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditVenuePage;
