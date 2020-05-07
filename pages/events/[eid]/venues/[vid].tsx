import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { useVenueQuery } from '../../../../hooks/queries/useVenueQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';
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
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { useSessionsByVenueQuery } from '../../../../hooks/queries/useSessionsByVenueQuery';
import { getSessionsByVenue, SessionWithVenue } from '../../../api/events/[eid]/sessions';
import { ViewVenue } from '../../../../components/venues/ViewVenue';

type Props = {
	initialVenue: Prisma.EventVenue | undefined;
	initialSessionsByVenue: SessionWithVenue[] | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenue, initialRoles, initialUser, initialEvent, initialSessionsByVenue } = props;
	const { vid, eid } = router.query;
	const { venue, isVenueLoading, venueError } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const sessionsByVenueQuery = useSessionsByVenueQuery(
		String(eid),
		String(vid),
		initialSessionsByVenue
	);

	if (isVenueLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError || eventError || rolesError || sessionsByVenueQuery.error) {
		return (
			<ViewErrorPage
				errors={[venueError, eventError, rolesError, sessionsByVenueQuery.error?.response?.data]}
			/>
		);
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
					<h1 className="text-2xl md:text-3xl font-bold">{venue.name}</h1>
				</FlexRowBetween>

				<ViewVenue venue={venue} sessionsByVenueQuery={sessionsByVenueQuery} eid={String(eid)} />
			</Column>
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

	return {
		props: {
			initialUser,
			initialVenue,
			initialRoles,
			initialEvent,
			initialSessionsByVenue
		}
	};
};

export default ViewAttendeePage;
