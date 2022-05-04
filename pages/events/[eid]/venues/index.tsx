import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { VenueList } from '../../../../components/venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../components/layout/PageWrapper';

import Prisma from '@prisma/client';

import { getVenues } from '../../../api/events/[eid]/venues';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { EventHeader } from '../../../../components/events/EventHeader';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { getEvent } from '../../../api/events/[eid]';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { useUser } from '../../../../hooks/queries/useUser';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { getRoles } from '../../../api/events/[eid]/roles';
import { EventNavigation } from '../../../../components/events/navigation';

type Props = {
	initialVenues: Prisma.EventVenue[] | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenues, initialOrganizer, initialEvent, initialIsAttendeeByUserId, initialUser } =
		props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { event, isEventLoading } = useEventQuery(String(eid), initialEvent);
	const { user } = useUser(initialUser);
	const { attendee, isAttendeeLoading } = useAttendeeQuery(
		String(eid),
		String(user?.id),
		initialIsAttendeeByUserId
	);
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isVenuesLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError) {
		return <ViewErrorPage errors={[venuesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Venues</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={attendee}
					/>
				)}

				<FlexRowBetween>
					<h1 className="text-3xl font-bold leading-tight">Venues</h1>

					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/venues/create`} passHref>
							<LinkButton>Create venue</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<VenueList
					eid={String(eid)}
					venues={venues}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialUser,
			initialVenues,
			initialEvent,
			initialOrganizer,
			initialRoles,
			initialIsAttendeeByUserId
		}
	};
};

export default SessionsPage;
