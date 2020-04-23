import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { ServerError } from '../../../../components/ServerError';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import { ViewVenue } from '../../../../components/Venues/ViewVenue';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));

	return (
		<>
			<Head>
				<title>Viewing Venue: {vid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div>
					{venueError ? (
						<ServerError error={venueError} />
					) : (
						<ViewVenue venue={venue} eid={String(eid)} loading={isVenueLoading} vid={String(vid)} />
					)}
				</div>
			</Column>
		</>
	);
};

export default ViewAttendeePage;
