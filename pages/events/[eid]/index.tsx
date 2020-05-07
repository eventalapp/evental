import Prisma from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../components/events/EventHeader';
import { EventNavigation } from '../../../components/events/navigation';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { SessionList } from '../../../components/sessions/SessionList';
import { useAttendeeQuery } from '../../../hooks/queries/useAttendeeQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';
import { ssrGetUser } from '../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../utils/stripUserPassword';
import { getEvent } from '../../api/events/[eid]';
import { getAttendee } from '../../api/events/[eid]/attendees/[uid]';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getRoles } from '../../api/events/[eid]/roles';
import { getSessions, PaginatedSessionsWithVenue } from '../../api/events/[eid]/sessions';
import { getVenues } from '../../api/events/[eid]/venues';
import { useSessionTypesQuery } from '../../../hooks/queries/useSessionTypesQuery';
import { getSessionTypes } from '../../api/events/[eid]/sessions/types';
import { getDateRange } from '../../../utils/date';
import { format } from 'date-fns';
import { scrollTo } from '../../../utils/scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialSessions: PaginatedSessionsWithVenue | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendeeByUserId: AttendeeWithUser | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialVenues: Prisma.EventVenue[] | undefined;
	initialSessionTypes: Prisma.EventSessionType[] | undefined;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialOrganizer,
		initialUser,
		initialRoles,
		initialSessions,
		initialIsAttendeeByUserId,
		initialVenues,
		initialSessionTypes
	} = props;
	const [page, setPage] = useState(1);
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { sessionsData, isSessionsLoading, sessionsError } = useSessionsQuery(String(eid), {
		initialData: initialSessions,
		page
	});
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const {
		attendee: isAttendee,
		attendeeError,
		isAttendeeLoading
	} = useAttendeeQuery(String(eid), String(user?.id), initialIsAttendeeByUserId);
	const { venues, venuesError, isVenuesLoading } = useVenuesQuery(String(eid), initialVenues);
	const { sessionTypesError, isSessionTypesLoading, sessionTypes } = useSessionTypesQuery(
		String(eid),
		initialSessionTypes
	);

	if (
		isEventLoading ||
		isOrganizerLoading ||
		isSessionsLoading ||
		isRolesLoading ||
		isAttendeeLoading ||
		isVenuesLoading ||
		isSessionTypesLoading
	) {
		return <LoadingPage />;
	}

	if (
		rolesError ||
		eventError ||
		sessionsError ||
		attendeeError ||
		venuesError ||
		sessionTypesError
	) {
		return (
			<ViewErrorPage
				errors={[
					rolesError,
					eventError,
					sessionsError,
					attendeeError,
					venuesError,
					sessionTypesError
				]}
			/>
		);
	}

	if (!event || !sessionsData?.sessions || !roles) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>{event && event.name}</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} />

			<Column>
				{event && (
					<EventHeader
						adminLink={'/sessions'}
						eid={String(eid)}
						event={event}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
					/>
				)}

				<div className="grid grid-cols-12 gap-4">
					<div className="md:col-span-9 col-span-12">
						<h3 className="text-xl md:text-2xl font-medium">
							Sessions{' '}
							{sessionsData?.pagination?.total > 0 && (
								<span className="font-normal text-gray-500">
									({sessionsData?.pagination?.from || 0}/{sessionsData?.pagination?.total || 0})
								</span>
							)}
						</h3>

						<SessionList sessions={sessionsData.sessions} eid={String(eid)} />

						{sessionsData.pagination.pageCount > 0 && (
							<div className="flex flex-row justify-end items-center">
								<button
									onClick={() => {
										if (page > 1) {
											scrollTo(0);
											setPage((oldPage) => oldPage - 1);
										}
									}}
								>
									<FontAwesomeIcon className="mr-1.5" fill="currentColor" icon={faChevronLeft} />
									Prev
								</button>
								<span className="mx-4 text-lg font-medium">
									Page {page}/{sessionsData.pagination.pageCount}
								</span>
								<button
									disabled={!(page < sessionsData.pagination.pageCount)}
									className="disabled:text-gray-300 disabled:cursor-not-allowed"
									onClick={() => {
										if (page < sessionsData.pagination.pageCount) {
											scrollTo(0);
											setPage((oldPage) => oldPage + 1);
										}
									}}
								>
									Next
									<FontAwesomeIcon className="ml-1.5" fill="currentColor" icon={faChevronRight} />
								</button>
							</div>
						)}
					</div>
					<div className="md:col-span-3 col-span-12">
						<div className="mb-3">
							<span className="block font-medium border-b border-gray-200">Timezone</span>
						</div>

						{venues && venues.length > 0 && (
							<div className="mb-3">
								<span className="block font-medium border-b border-gray-200">Filter by Venue</span>
								<ul>
									{venues.map((venue) => (
										<Link key={venue.id} href={`/events/${eid}/venues/${venue.slug}`}>
											<a className="block">{venue.name}</a>
										</Link>
									))}
								</ul>
							</div>
						)}

						{sessionTypes && sessionTypes.length > 0 && (
							<div className="mb-3">
								<span className="block font-medium border-b border-gray-200">Filter by Type</span>
								<ul>
									{sessionTypes.map((sessionType) => (
										<Link
											key={sessionType.id}
											href={`/events/${eid}/sessions/types/${sessionType.slug}`}
										>
											<a className="block">{sessionType.name}</a>
										</Link>
									))}
								</ul>
							</div>
						)}

						<div className="mb-3">
							<span className="block font-medium border-b border-gray-200">Filter by Date</span>
							{getDateRange(new Date(event.startDate), new Date(event.endDate)).map((date, i) => (
								<Link
									key={`${date.toISOString()}-${i}`}
									href={`/events/${eid}/sessions/dates/${format(date, 'yyyy-MM-dd')}`}
								>
									<a className="block">{format(date, 'yyyy-MM-dd')}</a>
								</Link>
							))}
						</div>
					</div>
				</div>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialSessions = (await getSessions(String(eid))) ?? undefined;
	const initialSessionTypes = (await getSessionTypes(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendeeByUserId =
		(await getAttendee(String(eid), String(initialUser?.id))) ?? undefined;

	return {
		props: {
			initialEvent,
			initialUser,
			initialOrganizer,
			initialIsAttendeeByUserId,
			initialRoles,
			initialSessions,
			initialVenues,
			initialSessionTypes
		}
	};
};

export default ViewEventPage;
