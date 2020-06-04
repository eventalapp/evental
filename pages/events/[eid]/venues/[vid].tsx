import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import parse from 'html-react-parser';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../components/Footer';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../components/events/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Tooltip from '../../../../components/radix/components/Tooltip';
import { SessionList } from '../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useSessionsByVenueQuery } from '../../../../hooks/queries/useSessionsByVenueQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import { ssrGetUser } from '../../../../utils/api';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getEvent } from '../../../api/events/[eid]';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { getPages } from '../../../api/events/[eid]/pages';
import { getRoles } from '../../../api/events/[eid]/roles';
import { SessionWithVenue, getSessionsByVenue } from '../../../api/events/[eid]/sessions';
import { getVenue } from '../../../api/events/[eid]/venues/[vid]';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialSessionsByVenue: SessionWithVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialOrganizer: boolean;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const {
		initialVenue,
		initialRoles,
		initialUser,
		initialEvent,
		initialSessionsByVenue,
		initialPages,
		initialOrganizer
	} = props;
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { sessionsByVenueData, isSessionsByVenueLoading } = useSessionsByVenueQuery(
		String(eid),
		String(vid),
		{
			initialData: initialSessionsByVenue
		}
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);

	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isVenueLoading ||
		isEventLoading ||
		isRolesLoading ||
		isSessionsByVenueLoading ||
		isPagesLoading ||
		isOrganizerLoading
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

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title={`${venue.name} — ${event.name}`}
				description={`View all of the sessions occurring at ${venue.name}.`}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/venues/${venue.slug}`,
					title: `${venue.name} — ${event.name}`,
					description: `View all of the sessions occurring at ${venue.name}.`,
					images: [
						{
							url: `https://cdn.evental.app${event.image}`,
							width: 300,
							height: 300,
							alt: `${event.name} Logo Alt`,
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<div className="mb-5">
					<h3 className="text-xl md:text-2xl font-medium mb-1">{venue.name}</h3>

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

				{sessionsByVenueData && (
					<SessionList eid={String(eid)} sessions={sessionsByVenueData} event={event} />
				)}
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialSessionsByVenue = (await getSessionsByVenue(String(eid), String(vid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialVenue,
			initialRoles,
			initialEvent,
			initialSessionsByVenue,
			initialPages,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
