import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';
import Link from 'next/link';
import { ViewVenue } from '../../../../../../components/venues/ViewVenue';
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

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();

	if (isVenueLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!venue) {
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
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h1 className="text-2xl md:text-3xl font-bold">{venue.name}</h1>

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
					eid={String(eid)}
					vid={String(vid)}
					venue={venue}
					isVenueLoading={isVenueLoading}
					venueError={venueError}
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
