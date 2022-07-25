import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';

import { SessionWithVenueEvent, sessionWithEventListReducer } from '@eventalapp/shared/utils';

import { NotFound } from '../error/NotFound';
import { SessionHoverCard } from './SessionHoverCard';
import { sessionListSkeleton } from './SessionList';

type Props = {
	admin?: boolean;
	sessions?: SessionWithVenueEvent[];
};

export const SessionWithEventList: React.FC<Props> = (props) => {
	const { sessions, admin = false } = props;
	const [showPastEvents, setShowPastEvents] = useState(false);

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

	const previousSessions =
		sessions && sessions.filter((session) => dayjs(session.endDate).isBefore(new Date()));
	const upcomingSessions =
		sessions && sessions.filter((session) => dayjs(session.endDate).isAfter(new Date()));

	return (
		<div className="relative min-h-[25px]">
			{sessions ? (
				<>
					{' '}
					{previousSessions && previousSessions.length >= 1 && (
						<button
							className="absolute top-0 right-0 z-20 flex cursor-pointer flex-row items-center text-sm text-gray-500"
							onClick={() => {
								setShowPastEvents(!showPastEvents);
							}}
						>
							{showPastEvents ? (
								<FontAwesomeIcon fill="currentColor" className="mr-1.5 h-4 w-4" icon={faEyeSlash} />
							) : (
								<FontAwesomeIcon fill="currentColor" className="mr-1.5 h-4 w-4" icon={faEye} />
							)}
							{showPastEvents ? 'Hide' : 'Show'} past sessions
						</button>
					)}
					<div
						className={classNames(
							'overflow-hidden transition-all',
							showPastEvents ? 'h-auto' : 'h-0'
						)}
					>
						{previousSessions &&
							Object.entries(previousSessions.reduce(sessionWithEventListReducer, {})).map(
								([date, hourObject]) => {
									return (
										<div key={date}>
											<p className="mt-2 inline-block px-2 pb-0.5 text-xl">
												{dayjs(date).format('dddd, MMM D')}
											</p>
											{Object.entries(hourObject).map(([hour, sessions]) => {
												return (
													<div className="flex flex-row" key={hour}>
														<span className="w-24 py-2 pr-3 text-right text-sm text-gray-700">
															{dayjs(hour).format('h:mm A z')}
														</span>
														<div className="w-full">
															{sessions.map((session) => {
																if (!session.event) {
																	return null;
																}

																return (
																	<SessionHoverCard
																		admin={admin}
																		session={session}
																		event={session.event}
																		key={session.id}
																		redirect={false}
																	>
																		<div className="mr-2 mb-2 inline-block">
																			<Link
																				href={`/events/${session.event.slug}${
																					admin ? '/admin' : ''
																				}/sessions/${session.slug}`}
																			>
																				<a className="inline-block">
																					<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
																						<div className="flex grow flex-row flex-wrap justify-between py-2 px-3">
																							<div className="flex flex-row items-center justify-between">
																								<div
																									className="mr-3 h-4 w-4 rounded-full"
																									style={{
																										backgroundColor:
																											session?.category?.color ?? '#888888'
																									}}
																								/>
																								<div>
																									<span className="block text-lg leading-tight">
																										{session.name}
																									</span>{' '}
																									{session.category?.name ? (
																										<span className="text-sm text-gray-500">
																											{session.category?.name}
																										</span>
																									) : (
																										<em className="text-sm text-gray-500">
																											{'No Type'}
																										</em>
																									)}
																								</div>
																							</div>
																						</div>
																					</div>
																				</a>
																			</Link>
																		</div>
																	</SessionHoverCard>
																);
															})}
														</div>
													</div>
												);
											})}
										</div>
									);
								}
							)}
					</div>
					{upcomingSessions &&
						Object.entries(upcomingSessions.reduce(sessionWithEventListReducer, {})).map(
							([date, hourObject]) => {
								return (
									<div key={date}>
										<p className="mt-2 inline-block px-2 pb-0.5 text-xl">
											{dayjs(date).format('dddd, MMM D')}
										</p>
										{Object.entries(hourObject).map(([hour, sessions]) => {
											return (
												<div className="flex flex-row" key={hour}>
													<span className="w-24 py-2 pr-3 text-right text-sm text-gray-700">
														{dayjs(hour).format('h:mm A z')}
													</span>
													<div className="w-full">
														{sessions.map((session) => {
															if (!session.event) {
																return null;
															}

															return (
																<SessionHoverCard
																	admin={admin}
																	session={session}
																	event={session.event}
																	key={session.id}
																>
																	<div className="mr-2 mb-2 inline-block">
																		<Link
																			href={`/events/${session.event.slug}${
																				admin ? '/admin' : ''
																			}/sessions/${session.slug}`}
																		>
																			<a className="inline-block">
																				<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
																					<div className="flex grow flex-row flex-wrap justify-between py-2 px-3">
																						<div className="flex flex-row items-center justify-between">
																							<div
																								className="mr-3 h-4 w-4 rounded-full"
																								style={{
																									backgroundColor:
																										session?.category?.color ?? '#888888'
																								}}
																							/>
																							<div>
																								<span className="block text-lg leading-tight">
																									{session.name}
																								</span>

																								{session.category?.name ? (
																									<span className="text-sm text-gray-500">
																										{session.category?.name}
																									</span>
																								) : (
																									<em className="text-sm text-gray-500">
																										{'No Type'}
																									</em>
																								)}
																							</div>
																						</div>
																					</div>
																				</div>
																			</a>
																		</Link>
																	</div>
																</SessionHoverCard>
															);
														})}
													</div>
												</div>
											);
										})}
									</div>
								);
							}
						)}
				</>
			) : (
				sessionListSkeleton
			)}
		</div>
	);
};
