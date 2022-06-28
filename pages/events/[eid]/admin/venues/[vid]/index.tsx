import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewVenue } from '../../../../../../components/venues/ViewVenue';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionsByVenueQuery } from '../../../../../../hooks/queries/useSessionsByVenueQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const ViewVenuePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();
	const { isSessionsByVenueLoading, sessionsByVenueData } = useSessionsByVenueQuery(
		String(eid),
		String(vid)
	);

	if (
		isVenueLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isRolesLoading ||
		isSessionsByVenueLoading
	) {
		return <LoadingPage />;
	}

	if (!venue || !sessionsByVenueData) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError || eventError || rolesError) {
		return <ViewErrorPage errors={[venueError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewVenue
					eid={String(eid)}
					vid={String(vid)}
					event={event}
					sessions={sessionsByVenueData}
					user={user}
					venue={venue}
					admin
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewVenuePage;
