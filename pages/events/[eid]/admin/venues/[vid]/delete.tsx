import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteVenueForm } from '../../../../../../components/venues/DeleteVenueForm';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import { useDeleteVenueMutation } from '../../../../../../hooks/mutations/useDeleteVenueMutatation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';

const DeleteVenuePage: NextPage = () => {
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venue, venueError, isVenueLoading } = useVenueQuery(String(eid), String(vid));
	const { deleteVenueMutation } = useDeleteVenueMutation(String(eid), String(vid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isVenueLoading || isUserLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError) {
		return <ViewErrorPage errors={[venueError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Venue</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete a venue ("{venue.name}")
				</p>

				<h3 className="text-xl md:text-2xl font-medium">Delete Venue</h3>

				<DeleteVenueForm
					venue={venue}
					venueError={venueError}
					deleteVenueMutation={deleteVenueMutation}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteVenuePage;
