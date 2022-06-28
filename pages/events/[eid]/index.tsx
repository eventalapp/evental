import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Footer } from '../../../components/Footer';
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

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { user } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { isAttendee } = useIsAttendeeQuery(String(eid));
	const { sessionsData, sessionsError } = useSessionsQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { roles, rolesError } = useRolesQuery(String(eid));
	const { venues, venuesError } = useVenuesQuery(String(eid));
	const { sessionTypesError, sessionTypes } = useSessionTypesQuery(String(eid));
	const { pages } = usePagesQuery(String(eid));

	if (rolesError || eventError || sessionsError || venuesError || sessionTypesError) {
		return (
			<ViewErrorPage
				errors={[rolesError, eventError, sessionsError, venuesError, sessionTypesError]}
			/>
		);
	}

	if (event && user && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const renderDayContents = (dayOfMonth: number, date?: Date | undefined) => {
		if (
			event &&
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
			{event && (
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
			)}

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<EventHeader
					event={event}
					adminLink={'/sessions'}
					isOrganizer={isOrganizer}
					isAttendee={isAttendee}
					user={user}
				/>

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-12 lg:col-span-9">
						<SessionList sessions={sessionsData} eid={String(eid)} event={event} user={user} />
					</div>

					<div className="col-span-12 lg:col-span-3">
						<div className="mb-4">
							<span className="mb-1 block font-medium">
								{event ? 'Filter by Date' : <Skeleton className="w-3/4" />}
							</span>
							{event ? (
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
							) : (
								<Skeleton className="w-full" />
							)}
						</div>

						<div className="mb-4">
							<span className="mb-1 block font-medium">
								{sessionTypes ? (
									sessionTypes.length > 0 && 'Filter by Type'
								) : (
									<Skeleton className="w-3/4" />
								)}
							</span>
							<div className="text-gray-600">
								<ul className="space-y-1">
									{event && sessionTypes ? (
										sessionTypes.map((sessionType) => (
											<li className="block group" key={sessionType.id}>
												<Tooltip
													message={`Click to view all sessions occurring with the ${sessionType.name} session category`}
													side="left"
													sideOffset={6}
												>
													<div>
														<Link href={`/events/${event.slug}/sessions/types/${sessionType.slug}`}>
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
										))
									) : (
										<Skeleton count={5} className="w-full" containerClassName="space-y-1" />
									)}
								</ul>
							</div>
						</div>

						<div className="mb-4">
							<span className="mb-1 block font-medium">
								{venues ? venues.length > 0 && 'Filter by Venue' : <Skeleton className="w-3/4" />}
							</span>
							<div className="text-gray-600">
								<ul className="space-y-1">
									{event && venues ? (
										venues.map((venue) => (
											<li className="block group" key={venue.id}>
												<Tooltip
													message={`Click to view all sessions occurring at the ${venue.name} venue`}
													side="left"
													sideOffset={6}
												>
													<div>
														<Link href={`/events/${event.slug}/venues/${venue.slug}`} passHref>
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
										))
									) : (
										<Skeleton count={5} className="w-full" containerClassName="space-y-1" />
									)}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewEventPage;
