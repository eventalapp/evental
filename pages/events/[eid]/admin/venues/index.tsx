import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { LinkButton } from '../../../../../components/Form/LinkButton';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/useVenuesQuery';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { venues, isVenuesLoading } = useVenuesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

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
					<h1 className="text-3xl">Venues Admin Page</h1>
					<Link href={`/events/${eid}/admin/venues/create`} passHref>
						<LinkButton className="mr-3">Create venue</LinkButton>
					</Link>
				</div>

				{isVenuesLoading ? (
					<p>Venues loading...</p>
				) : (
					<div>
						{venues &&
							venues.map((venue) => (
								<div key={venue.id} className="py-3 border-b-2 border-gray-200">
									<Link href={`/events/${eid}/venues/${venue.id}`}>
										<a>
											<span className="text-lg block">{venue.name}</span>
											<span className="text-md block">{venue.description}</span>
										</a>
									</Link>
								</div>
							))}
					</div>
				)}
			</Column>
		</>
	);
};

export default ActivitiesPage;
