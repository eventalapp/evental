import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteVenueForm } from '../../../../../../components/venues/DeleteVenueForm';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import { useDeleteVenueMutation } from '../../../../../../hooks/mutations/useDeleteVenueMutatation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

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
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return (
			<PageWrapper variant="gray">
				<NoAccess />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Venue</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Venue Page</h1>

				<DeleteVenueForm
					venue={venue}
					venueError={venueError}
					deleteVenueMutation={deleteVenueMutation}
					deleteVenueError={deleteVenueError}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteVenuePage;
