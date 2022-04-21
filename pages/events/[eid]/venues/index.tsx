import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import NoAccess from '../../../../components/NoAccess';
import { useOrganizerQuery } from '../../../../hooks/useOrganizerQuery';
import { useVenuesQuery } from '../../../../hooks/useVenuesQuery';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { venues, isVenuesLoading } = useVenuesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Venues Page</h1>
					{isVenuesLoading ? (
						<p>Venues loading...</p>
					) : (
						venues && venues.map((venue) => <div key={venue.id}>{venue.name}</div>)
					)}
				</div>
			</Column>
		</>
	);
};

export default ActivitiesPage;
