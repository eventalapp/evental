import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { VenueList } from '../../../../components/venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
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
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';
import { NextSeo } from 'next-seo';
import { PrivatePage } from '../../../../components/error/PrivatePage';

type Props = {
	initialVenues: Prisma.EventVenue[] | undefined;
	initialEvent: Prisma.Event | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialPages: Prisma.EventPage[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
};

const SessionsPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const {
		initialVenues,
		initialOrganizer,
		initialEvent,
		initialIsAttendeeByUserId,
		initialUser,
		initialRoles,
		initialPages
	} = props;
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
	const { roles, isRolesLoading } = useRolesQuery(String(eid), initialRoles);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isVenuesLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isAttendeeLoading ||
		isRolesLoading ||
		isPagesLoading
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

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper variant="gray">
			<NextSeo
				title={`Venues — ${event.name}`}
				description={`View all of the venues for ${event.name}.`}
				openGraph={{
					url: `https://evental.app/events/${event.slug}/venues`,
					title: `Venues — ${event.name}`,
					description: `View all of the venues for ${event.name}.`,
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
				{event && (
					<EventHeader
						adminLink={'/venues'}
						event={event}
						eid={String(eid)}
						isOrganizer={isOrganizer}
						isAttendee={attendee}
					/>
				)}

				<h3 className="text-xl md:text-2xl font-medium">Venues</h3>

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
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialVenues,
			initialEvent,
			initialOrganizer,
			initialRoles,
			initialIsAttendeeByUserId,
			initialPages
		}
	};
};

export default SessionsPage;
