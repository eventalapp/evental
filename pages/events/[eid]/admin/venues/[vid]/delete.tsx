import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/Column';
import { Navigation } from '../../../../../../components/Navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteVenueForm } from '../../../../../../components/Venues/DeleteVenueForm';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import { useDeleteVenueMutation } from '../../../../../../hooks/mutations/useDeleteVenueMutatation';

const DeleteVenuePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { deleteVenueMutation, deleteVenueError } = useDeleteVenueMutation(
		String(eid),
		String(vid)
	);
	const { venue, venueError, isVenueLoading } = useVenueQuery(String(eid), String(vid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Delete Venue</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Delete Venue Page</h1>

				<DeleteVenueForm
					eid={String(eid)}
					vid={String(vid)}
					venue={venue}
					venueError={venueError}
					deleteVenueMutation={deleteVenueMutation}
					deleteVenueError={deleteVenueError}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</>
	);
};

export default DeleteVenuePage;
