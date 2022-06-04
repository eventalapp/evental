import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { LinkButton } from '../../../../../../components/form/LinkButton';
import Column from '../../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import Tooltip from '../../../../../../components/radix/components/Tooltip';
import { SessionList } from '../../../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionsByVenueQuery } from '../../../../../../hooks/queries/useSessionsByVenueQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const ViewVenuePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(String(eid), String(vid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
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
				<div className="mb-5">
					<FlexRowBetween className="mb-1">
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

					<Tooltip
						message={
							venue.address
								? `This is venue is located at ${venue?.address}.`
								: 'This venue has not specified an address'
						}
					>
						<div className="inline-flex flex-row items-center mb-1 cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faLocationDot}
							/>
							{venue.address ? <p>{venue.address}</p> : <em>No Address</em>}
						</div>
					</Tooltip>

					{venue.description && (
						<div className="prose focus:outline-none prose-a:text-primary mt-1">
							{parse(String(venue.description))}
						</div>
					)}
				</div>

				<h3 className="text-xl md:text-2xl font-medium">
					Sessions{' '}
					<span className="font-normal text-gray-500">({sessionsByVenueData.length || 0})</span>
				</h3>

				<SessionList eid={String(eid)} sessions={sessionsByVenueData} event={event} admin />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default ViewVenuePage;
