import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Footer } from '../../../components/Footer';
import { NotFoundPage } from '../../../components/error/NotFoundPage';
import { PrivatePage } from '../../../components/error/PrivatePage';
import { EventHeader } from '../../../components/events/EventHeader';
import { SessionDatePicker } from '../../../components/events/SessionDatePicker';
import { EventNavigation } from '../../../components/events/navigation';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import Tooltip from '../../../components/radix/components/Tooltip';
import { SessionList } from '../../../components/sessions/SessionList';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../hooks/queries/useIsOrganizerQuery';
import { useSessionTypesQuery } from '../../../hooks/queries/useSessionTypesQuery';
import { useSessionsQuery } from '../../../hooks/queries/useSessionsQuery';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { sessionsData } = useSessionsQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));
	const { venues } = useVenuesQuery(String(eid));
	const { sessionTypes } = useSessionTypesQuery(String(eid));

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
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

			<EventNavigation eid={String(eid)} />

			<Column>
				<EventHeader adminLink={'/sessions'} eid={String(eid)} />

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-12 lg:col-span-9">
						<SessionList sessions={sessionsData} event={event} />
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
								{event && sessionTypes ? (
									sessionTypes.length > 0 && 'Filter by Type'
								) : (
									<Skeleton className="w-3/4" />
								)}
							</span>
							<div className="text-gray-600">
								<ul className="space-y-1">
									{event && sessionTypes ? (
										sessionTypes.map((sessionType) => (
											<li key={sessionType.id}>
												<Link href={`/events/${event.slug}/sessions/types/${sessionType.slug}`}>
													<a>
														<Tooltip
															message={`Click to view all sessions occurring with the ${sessionType.name} session category`}
															side="left"
															sideOffset={6}
														>
															<div className="inline-block">
																<div className="flex flex-row items-center justify-center">
																	<div
																		className="mr-2 h-3 w-3 rounded-full"
																		style={{ backgroundColor: sessionType.color ?? '#888888' }}
																	/>
																	<span className="transition-all duration-100 hover:text-gray-900">
																		{sessionType.name}
																	</span>
																</div>
															</div>
														</Tooltip>
													</a>
												</Link>
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
								{event && venues ? (
									venues.length > 0 && 'Filter by Venue'
								) : (
									<Skeleton className="w-3/4" />
								)}
							</span>
							<div className="text-gray-600">
								<ul className="space-y-1">
									{event && venues ? (
										venues.map((venue) => (
											<li key={venue.id}>
												<Link href={`/events/${event.slug}/venues/${venue.slug}`} passHref>
													<a>
														<Tooltip
															message={`Click to view all sessions occurring at the ${venue.name} venue`}
															side="left"
															sideOffset={6}
														>
															<div className="inline-block">
																<span className="transition-all duration-100 hover:text-gray-900">
																	{venue.name}
																</span>
															</div>
														</Tooltip>
													</a>
												</Link>
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
