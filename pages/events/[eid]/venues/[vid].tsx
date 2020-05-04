import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import { ViewVenue } from '../../../../components/venues/ViewVenue';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getVenue } from '../../../api/events/[eid]/venues/[vid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/stripUserPassword';
import { ssrGetUser } from '../../../../utils/api';
import { EventNavigation } from '../../../../components/events/navigation';
import { getEvent } from '../../../api/events/[eid]';
import { getRoles } from '../../../api/events/[eid]/roles';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import Link from 'next/link';
import { LinkButton } from '../../../../components/form/LinkButton';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenue, initialOrganizer, initialRoles, initialUser, initialEvent } = props;
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);

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

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Venue: {venue && venue.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">{venue.name}</h1>

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
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					isVenueLoading={isVenueLoading}
					venueError={venueError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialVenue,
			initialOrganizer,
			initialRoles,
			initialEvent
		}
	};
};

export default ViewAttendeePage;
