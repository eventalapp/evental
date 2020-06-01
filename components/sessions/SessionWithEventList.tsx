import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';

import { SessionWithVenueEvent } from '../../pages/api/users/[uid]/sessions';
import { sessionWithEventListReducer } from '../../utils/reducer';
import { NotFound } from '../error/NotFound';
import { SessionHoverCard } from '../radix/components/SessionHoverCard';
import Button from '../radix/components/shared/Button';

type Props = {
	admin?: boolean;
	sessions: SessionWithVenueEvent[];
};

export const SessionWithEventList: React.FC<Props> = (props) => {
	const { sessions, admin = false } = props;
	const [showPastEvents, setShowPastEvents] = useState(false);

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

	if (!sessions) return null;

	const previousSessions = sessions.filter((session) =>
		dayjs(session.endDate).isBefore(new Date())
	);
	const upcomingSessions = sessions.filter((session) => dayjs(session.endDate).isAfter(new Date()));

	return (
		<div className="mt-3">
			{previousSessions && previousSessions.length >= 1 && (
				<>
					<Button
						className="cursor-pointer"
						onClick={() => {
							setShowPastEvents(!showPastEvents);
						}}
					>
						{showPastEvents ? 'Hide' : 'Show'} previous sessions{' '}
						<FontAwesomeIcon
							fill="currentColor"
							className="ml-1 w-4 h-4 text-gray-600"
							size="1x"
							style={{ transform: showPastEvents ? '' : 'rotate(180deg)' }}
							icon={faChevronUp}
						/>
					</Button>

					<div
						className={classNames(
							'transition-all overflow-hidden',
							showPastEvents ? 'h-auto' : 'h-0'
						)}
					>
						{Object.entries(previousSessions.reduce(sessionWithEventListReducer, {})).map(
							([date, hourObject]) => {
								return (
									<div key={date}>
										<p className="text-xl mt-2 pb-0.5 border-b-2 px-2 border-gray-200 inline-block">
											{dayjs(date).format('dddd, MMM D')}
										</p>
										{Object.entries(hourObject).map(([hour, sessions]) => {
											return (
												<div className="flex flex-row" key={hour}>
													<span className="text-gray-700 text-sm w-24 py-2 pr-3 text-right border-r-2 border-gray-200">
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
																				<div className="flex flex-row hover:bg-gray-50 transition-all duration-100 rounded-md">
																					<div className="py-2 flex flex-row justify-between flex-grow px-3 flex-wrap">
																						<div className="flex flex-row items-center justify-between">
																							<div
																								className="rounded-full mr-3 w-4 h-4"
																								style={{
																									backgroundColor: session?.type?.color ?? '#888888'
																								}}
																							/>
																							<div>
																								<span className="text-lg block leading-tight">
																									{session.name}
																								</span>{' '}
																								{session.type?.name ? (
																									<span className="text-sm text-gray-500">
																										{session.type?.name}
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
				</>
			)}

			{Object.entries(upcomingSessions.reduce(sessionWithEventListReducer, {})).map(
				([date, hourObject]) => {
					return (
						<div key={date}>
							<p className="text-xl mt-2 pb-0.5 border-b-2 px-2 border-gray-200 inline-block">
								{dayjs(date).format('dddd, MMM D')}
							</p>
							{Object.entries(hourObject).map(([hour, sessions]) => {
								return (
									<div className="flex flex-row" key={hour}>
										<span className="text-gray-700 text-sm w-24 py-2 pr-3 text-right border-r-2 border-gray-200">
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
														<div className="inline-block mr-2 mb-2">
															<Link
																href={`/events/${session.event.slug}${
																	admin ? '/admin' : ''
																}/sessions/${session.slug}`}
															>
																<a className="inline-block">
																	<div className="flex flex-row hover:bg-gray-50 transition-all duration-100 rounded-md">
																		<div className="py-2 flex flex-row justify-between flex-grow px-3 flex-wrap">
																			<div className="flex flex-row items-center justify-between">
																				<div
																					className="rounded-full mr-3 w-4 h-4"
																					style={{
																						backgroundColor: session?.type?.color ?? '#888888'
																					}}
																				/>
																				<div>
																					<span className="text-lg block leading-tight">
																						{session.name}
																					</span>

																					{session.type?.name ? (
																						<span className="text-sm text-gray-500">
																							{session.type?.name}
																						</span>
																					) : (
																						<em className="text-sm text-gray-500">{'No Type'}</em>
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
	);
};
