import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import type { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../components/events/EventHeader';
import { SessionDatePicker } from '../../../components/events/SessionDatePicker';
import { EventNavigation } from '../../../components/events/navigation';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import Tooltip from '../../../components/radix/components/Tooltip';
import { SessionList } from '../../../components/sessions/SessionList';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { usePagesQuery } from '../../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useSessionTypesQuery } from '../../../hooks/queries/useSessionTypesQuery';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';
import { ssrGetUser } from '../../../utils/api';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { getEvent } from '../../api/events/[eid]';
import { getIsAttendee } from '../../api/events/[eid]/attendee';
import { getIsOrganizer } from '../../api/events/[eid]/organizer';
import { getPages } from '../../api/events/[eid]/pages';
import { getRoles } from '../../api/events/[eid]/roles';
import { SessionWithVenue, getSessions } from '../../api/events/[eid]/sessions';
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
					<div className="col-span-12 lg:col-span-9">
						<SessionList sessions={sessionsData} eid={String(eid)} event={event} user={user} />
					</div>

					<div className="col-span-12 lg:col-span-3">
						<div className="mb-3">
							<span className="mb-1 block font-medium">Filter by Date</span>
							<div className="relative">
								<SessionDatePicker
									onChange={(date) => {
										void router.push(
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
								<span className="mb-1 block font-medium">Filter by Type</span>
								<div className="text-gray-600">
									<ul className="space-y-1">
										{sessionTypes.map((sessionType) => (
											<li className="block group" key={sessionType.id}>
												<Tooltip
													message={`Click to view all sessions occurring with the ${sessionType.name} session category`}
													side="left"
													sideOffset={6}
												>
													<div>
														<Link href={`/events/${eid}/sessions/types/${sessionType.slug}`}>
															<a className="inline-flex justify-between w-full">
																<div className="flex flex-row items-center justify-center">
																	<div
																		className="mr-2 h-3 w-3 rounded-full"
																		style={{ backgroundColor: sessionType.color ?? '#888888' }}
																	/>
																	<span className="transition-all duration-100 group-hover:text-gray-900">
																		{sessionType.name}
																	</span>
																</div>
																<FontAwesomeIcon
																	fill="currentColor"
																	size="1x"
																	className="h-5 w-5 text-gray-700 opacity-0 group-hover:opacity-100 -mr-5 group-hover:-mr-0 transition-all duration-100"
																	icon={faArrowRight}
																/>
															</a>
														</Link>
													</div>
												</Tooltip>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}

						{venues && venues.length > 0 && (
							<div className="mb-3">
								<span className="mb-1 block font-medium">Filter by Venue</span>
								<div className="text-gray-600">
									<ul className="space-y-1">
										{venues.map((venue) => (
											<li className="block group" key={venue.id}>
												<Tooltip
													message={`Click to view all sessions occurring at the ${venue.name} venue`}
													side="left"
													sideOffset={6}
												>
													<div>
														<Link href={`/events/${eid}/venues/${venue.slug}`} passHref>
															<a className="inline-flex justify-between w-full">
																<span className="transition-all duration-100 group-hover:text-gray-900">
																	{venue.name}
																</span>
																<FontAwesomeIcon
																	fill="currentColor"
																	size="1x"
																	className="h-5 w-5 text-gray-700 opacity-0 group-hover:opacity-100 -mr-5 group-hover:-mr-0 transition-all duration-100"
																	icon={faArrowRight}
																/>
															</a>
														</Link>
													</div>
												</Tooltip>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
				</div>
			</Column>

			<Footer color={event.color} />
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
