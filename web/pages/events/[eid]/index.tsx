import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import {
	useEvent,
	useIsOrganizer,
	useSessionCategories,
	useSessions,
	useVenues
} from '@eventalapp/shared/hooks';

import { PrivatePage } from '../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../components/events/EventHeader';
import { EventNavigation } from '../../../components/events/Navigation';
import { SessionDatePicker } from '../../../components/events/SessionDatePicker';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import Tooltip from '../../../components/primitives/Tooltip';
import { SessionList } from '../../../components/sessions/SessionList';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { data: sessions } = useSessions({ eid: String(eid) });
	const { data: event, error: eventError } = useEvent({ eid: String(eid) });
	const { data: venues } = useVenues({ eid: String(eid) });
	const { data: sessionCategories } = useSessionCategories({ eid: String(eid) });

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
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

	const Seo = event && (
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
	);
	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={'/sessions'} eid={String(eid)} />

					<div className="grid grid-cols-12 gap-4">
						<div className="col-span-12 lg:col-span-9">
							<SessionList sessions={sessions} event={event} />
						</div>

						<div className="col-span-12 lg:col-span-3">
							<div className="mb-4">
								<span className="mb-1 block font-medium">
									{event && venues && sessionCategories ? (
										'Filter by Date'
									) : (
										<Skeleton className="w-3/4" />
									)}
								</span>
								{event && venues && sessionCategories ? (
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
									{event && venues && sessionCategories ? (
										sessionCategories.length > 0 && 'Filter by Category'
									) : (
										<Skeleton className="w-3/4" />
									)}
								</span>
								<div className="text-gray-600">
									<ul className="space-y-1">
										{event && sessionCategories && venues ? (
											sessionCategories.map((sessionCategory) => (
												<li key={sessionCategory.id}>
													<Link
														href={`/events/${event.slug}/sessions/categories/${sessionCategory.slug}`}
													>
														<a>
															<Tooltip
																message={`View all sessions occurring with the ${sessionCategory.name} session category`}
																side="left"
																sideOffset={12}
															>
																<div className="inline-block">
																	<div className="flex flex-row items-center justify-center">
																		<div
																			className="mr-2 h-3 w-3 rounded-full"
																			style={{
																				backgroundColor: sessionCategory.color ?? '#888888'
																			}}
																		/>
																		<span className="transition-all duration-100 hover:text-gray-900">
																			{sessionCategory.name}
																		</span>
																	</div>
																</div>
															</Tooltip>
														</a>
													</Link>
												</li>
											))
										) : (
											<Skeleton count={8} className="w-full" containerClassName="space-y-1" />
										)}
									</ul>
								</div>
							</div>

							<div className="mb-4">
								<span className="mb-1 block font-medium">
									{event && venues && sessionCategories ? (
										venues.length > 0 && 'Filter by Venue'
									) : (
										<Skeleton className="w-3/4" />
									)}
								</span>
								<div className="text-gray-600">
									<ul className="space-y-1">
										{event && venues && sessionCategories ? (
											venues.map((venue) => (
												<li key={venue.id}>
													<Link href={`/events/${event.slug}/venues/${venue.slug}`} passHref>
														<a>
															<Tooltip
																message={`View all sessions occurring at the ${venue.name} venue`}
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
											<Skeleton count={12} className="w-full" containerClassName="space-y-1" />
										)}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</Column>
			</PageWrapper>
			<Footer color={event?.color} />
		</>
	);
};

export default ViewEventPage;
