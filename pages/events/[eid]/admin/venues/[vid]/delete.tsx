import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../../components/Footer';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeleteVenueForm } from '../../../../../../components/venues/DeleteVenueForm';
import { useDeleteVenueMutation } from '../../../../../../hooks/mutations/useDeleteVenueMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const DeleteVenuePage: NextPage = () => {
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
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
		<PageWrapper>
			<Head>
				<title>Delete Venue</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block py-3 px-5 mb-4 font-medium text-white bg-red-500 rounded-md">
					You are about to delete a venue ("{venue.name}")
				</p>

				<h3 className="text-xl font-medium md:text-2xl">Delete Venue</h3>

				<DeleteVenueForm
					venue={venue}
					venueError={venueError}
					deleteVenueMutation={deleteVenueMutation}
					isVenueLoading={isVenueLoading}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default DeleteVenuePage;
