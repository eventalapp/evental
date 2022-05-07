import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';
import Link from 'next/link';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { LinkButton } from '../../../../../../components/form/LinkButton';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import Column from '../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { useSessionsByVenueQuery } from '../../../../../../hooks/queries/useSessionsByVenueQuery';
import { ViewVenue } from '../../../../../../components/venues/ViewVenue';

const ViewVenuePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();
	const sessionsByVenueQuery = useSessionsByVenueQuery(String(eid), String(vid));

	if (
		isVenueLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isRolesLoading ||
		sessionsByVenueQuery.isLoading
	) {
		return <LoadingPage />;
	}

	if (!venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError || eventError || rolesError || sessionsByVenueQuery.error?.response?.data) {
		return (
			<ViewErrorPage
				errors={[venueError, eventError, rolesError, sessionsByVenueQuery.error?.response?.data]}
			/>
		);
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">{venue.name}</h3>

					<div>
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/venues/${vid}/edit`} passHref>
								<LinkButton className="mr-3">Edit venue</LinkButton>
							</Link>
						)}
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/venues/${vid}/delete`} passHref>
								<LinkButton className="mr-3">Delete venue</LinkButton>
							</Link>
						)}
					</div>
				</FlexRowBetween>

				<ViewVenue
					venue={venue}
					sessionsByVenueQuery={sessionsByVenueQuery}
					eid={String(eid)}
					admin
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewVenuePage;
