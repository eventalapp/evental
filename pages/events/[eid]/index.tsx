import Prisma from '@prisma/client';
import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import type { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../components/events/EventHeader';
import { EventNavigation } from '../../../components/events/navigation';
import { SessionDatePicker } from '../../../components/events/SessionDatePicker';
import { Footer } from '../../../components/Footer';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import Tooltip from '../../../components/radix/components/Tooltip';
import { SessionList } from '../../../components/sessions/SessionList';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useSessionTypesQuery } from '../../../hooks/queries/useSessionTypesQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';
import { ssrGetUser } from '../../../utils/api';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getEvent } from '../../api/events/[eid]';
import { getIsAttendee } from '../../api/events/[eid]/attendee';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getPages } from '../../api/events/[eid]/pages';
import { getRoles } from '../../api/events/[eid]/roles';
import { getSessions, SessionWithVenue } from '../../api/events/[eid]/sessions';
import { getSessionTypes } from '../../api/events/[eid]/sessions/types';
import { getVenues } from '../../api/events/[eid]/venues';

type Props = {
	initialEvent: Prisma.Event | undefined;
	initialSessions: SessionWithVenue[] | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialIsAttendee: boolean;
	initialIsOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
	initialVenues: Prisma.EventVenue[] | undefined;
	initialSessionTypes: Prisma.EventSessionType[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewEventPage: NextPage<Props> = (props) => {
	const {
		initialEvent,
		initialIsOrganizer,
		initialUser,
		initialRoles,
		initialSessions,
		initialIsAttendee,
		initialVenues,
		initialSessionTypes,
		initialPages
	} = props;

	console.log({
		initialEvent,
		initialIsOrganizer,
		initialUser,
		initialRoles,
		initialSessions,
		initialIsAttendee,
		initialVenues,
		initialSessionTypes,
		initialPages
	});
	const router = useRouter();
	const { eid } = router.query;
	const { user } = useUser(initialUser);
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid), initialIsOrganizer);
	const { isAttendee, isAttendeeLoading } = useIsAttendeeQuery(String(eid), initialIsAttendee);
	const { sessionsData, isSessionsLoading, sessionsError } = useSessionsQuery(String(eid), {
		initialData: initialSessions
	});
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { venues, venuesError, isVenuesLoading } = useVenuesQuery(String(eid), initialVenues);
	const { sessionTypesError, isSessionTypesLoading, sessionTypes } = useSessionTypesQuery(
		String(eid),
		initialSessionTypes
	);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});

	if (
		isEventLoading ||
		isOrganizerLoading ||
		isSessionsLoading ||
		isRolesLoading ||
		isAttendeeLoading ||
		isVenuesLoading ||
		isSessionTypesLoading ||
		isPagesLoading
	) {
		return <LoadingPage />;
	}

	if (rolesError || eventError || sessionsError || venuesError || sessionTypesError) {
		return (
			<ViewErrorPage
				errors={[rolesError, eventError, sessionsError, venuesError, sessionTypesError]}
			/>
		);
	}

	if (!event || !sessionsData || !roles) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event.privacy === 'PRIVATE' && !isOrganizer) {
		return <PrivatePage />;
	}

	const renderDayContents = (dayOfMonth: number, date?: Date | undefined) => {
		if (
			dayjs(date)
				.add(6, 'hour')
				.isBetween(dayjs(event.startDate).startOf('day'), dayjs(event.endDate).endOf('day'))
		) {
			return (
				<Tooltip message={`View sessions for ${dayjs(date).format('MMMM D')}`} side="top">
					<span>{dayOfMonth}</span>
				</Tooltip>
			);
		}

		return <span>{dayOfMonth}</span>;
	};

	return (
		<PageWrapper>
			<NextSeo
				title={`${event.name} — Evental`}
				description={htmlToText(event.description || '')}
				additionalLinkTags={[
					{
						rel: 'icon',
						href: `https://cdn.evental.app${event.image}`
					}
				]}
				openGraph={{
					url: `https://evental.app/events/${event.slug}`,
					title: `${event.name} — Evental`,
					description: htmlToText(event.description || ''),
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
						adminLink={'/sessions'}
						eid={String(eid)}
						event={event}
						isOrganizer={isOrganizer}
						isAttendee={isAttendee}
						user={user}
					/>
				)}

				<div className="grid grid-cols-12 gap-4">
					<div className="lg:col-span-9 col-span-12">
						<SessionList sessions={sessionsData} eid={String(eid)} event={event} user={user} />
					</div>
					<div className="lg:col-span-3 col-span-12">
						<div className="mb-3">
							<span className="block font-medium mb-1">Filter by Date</span>
							<div className="relative">
								<SessionDatePicker
									onChange={(date) => {
										router.push(
											`/events/${eid}/sessions/dates/${dayjs(date).format('YYYY-MM-DD')}`
										);
									}}
									renderDayContents={renderDayContents}
									maxDate={new Date(String(event.endDate))}
									minDate={new Date(String(event.startDate))}
								/>
							</div>
						</div>

						{sessionTypes && sessionTypes.length > 0 && (
							<div className="mb-3">
								<span className="block font-medium mb-1">Filter by Type</span>
								<div className="text-gray-600">
									<ul>
										{sessionTypes.map((sessionType) => (
											<Link
												key={sessionType.id}
												href={`/events/${eid}/sessions/types/${sessionType.slug}`}
											>
												<a className="flex flex-row items-center">
													<div
														className="rounded-full mr-2 w-3 h-3"
														style={{ backgroundColor: sessionType.color ?? '#888888' }}
													/>
													{sessionType.name}
												</a>
											</Link>
										))}
									</ul>
								</div>
							</div>
						)}

						{venues && venues.length > 0 && (
							<div className="mb-3">
								<span className="block font-medium mb-1">Filter by Venue</span>
								<div className="text-gray-600">
									<ul>
										{venues.map((venue) => (
											<Link key={venue.id} href={`/events/${eid}/venues/${venue.slug}`}>
												<a className="block">{venue.name}</a>
											</Link>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
				</div>
			</Column>

			<Footer />
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
	const initialIsOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialIsAttendee =
		(await getIsAttendee({ eid: String(eid), userId: String(initialUser?.id) })) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialEvent,
			initialUser,
			initialIsOrganizer,
			initialIsAttendee,
			initialRoles,
			initialSessions,
			initialVenues,
			initialSessionTypes,
			initialPages
		}
	};
};

export default ViewEventPage;
