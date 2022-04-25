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
import { EditVenueForm } from '../../../../../../components/Venues/EditVenueForm';
import { useEditVenueMutation } from '../../../../../../hooks/mutations/useEditVenueMutation';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const EditVenuePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { editVenueMutation, editVenueError } = useEditVenueMutation(String(eid), String(vid));
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
				<title>Edit Venue</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton />

				<h1 className="text-3xl">Edit Venue Page</h1>

				<EditVenueForm
					venue={venue}
					venueError={venueError}
					editVenueMutation={editVenueMutation}
					editVenueError={editVenueError}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</>
	);
};

export default EditVenuePage;
