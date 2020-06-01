import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { sessionListReducer } from '../../utils/reducer';
import { HorizontalTextRule } from '../HorizontalTextRule';
import { NotFound } from '../error/NotFound';
import { SessionHoverCard } from '../radix/components/SessionHoverCard';

type Props = {
	eid: string;
	admin?: boolean;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
};

export const SessionList: React.FC<Props> = (props) => {
	const { eid, sessions, event, admin = false } = props;
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
		<div className="relative">
			<button
				className="text-gray-500 cursor-pointer absolute top-0 right-0 z-20"
				onClick={() => {
					setShowPastEvents(!showPastEvents);
				}}
			>
				{showPastEvents ? 'Hide' : 'Show'} past sessions{' '}
				<FontAwesomeIcon
					fill="currentColor"
					className="ml-0.5 w-3.5 h-3.5"
					style={{ transform: showPastEvents ? '' : 'rotate(180deg)' }}
					icon={faChevronUp}
				/>
			</button>

			{previousSessions && previousSessions.length >= 1 && (
				<div
					className={classNames(
						'transition-all overflow-hidden',
						showPastEvents ? 'h-auto' : 'h-0'
					)}
				>
					{Object.entries(previousSessions.reduce(sessionListReducer, {})).map(
						([date, hourObject]) => {
							return (
								<div key={date}>
									<p className="text-xl pb-0.5 inline-block text-gray-700">
										<span className="font-medium text-gray-900">{dayjs(date).format('dddd')}</span>,{' '}
										{dayjs(date).format('MMMM D')}
									</p>
									{Object.entries(hourObject).map(([hour, sessions]) => {
										return (
											<div className="flex flex-row" key={hour}>
												<span className="text-gray-700 text-sm w-24 py-2 pr-5 text-right">
													{dayjs(hour).format('h:mm A z')}
												</span>
												<div className="w-full">
													{sessions.map((session) => {
														return (
															<SessionHoverCard session={session} event={event} key={session.id}>
																<div className="mr-2 mb-2 inline-block">
																	<Link
																		href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${
																			session.slug
																		}`}
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

																							{session.roleMembers.length >= 1 && (
																								<span className="text-sm text-gray-500">
																									{session.roleMembers
																										.map((member) => member.attendee.user.name)
																										.splice(0, 3)
																										.join(', ')}
																								</span>
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
			)}

			{showPastEvents && <HorizontalTextRule text="Upcoming Sessions" />}

			{Object.entries(upcomingSessions.reduce(sessionListReducer, {})).map(([date, hourObject]) => {
				return (
					<div key={date}>
						<p className="text-xl pb-0.5 inline-block text-gray-700">
							<span className="font-medium text-gray-900">{dayjs(date).format('dddd')}</span>,{' '}
							{dayjs(date).format('MMMM D')}
						</p>
						{Object.entries(hourObject).map(([hour, sessions]) => {
							return (
								<div className="flex flex-row" key={hour}>
									<span className="text-gray-700 text-sm w-24 py-2 pr-5 text-right">
										{dayjs(hour).format('h:mm A z')}
									</span>
									<div className="w-full">
										{sessions.map((session) => (
											<SessionHoverCard session={session} event={event} key={session.id}>
												<div className="inline-block mr-2 mb-2">
													<Link
														href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${session.slug}`}
													>
														<a className="inline-block">
															<div className="flex flex-row hover:bg-gray-50 transition-all duration-100 rounded-md">
																<div className="py-2 flex flex-row justify-between flex-grow px-3 flex-wrap">
																	<div className="flex flex-row items-center justify-between">
																		<div
																			className="rounded-full mr-3 w-4 h-4"
																			style={{ backgroundColor: session?.type?.color ?? '#888888' }}
																		/>
																		<div>
																			<span className="text-lg block leading-tight">
																				{session.name}
																			</span>

																			{session.roleMembers.length >= 1 && (
																				<span className="text-sm text-gray-500">
																					{session.roleMembers
																						.map((member) => member.attendee.user.name)
																						.splice(0, 3)
																						.join(', ')}
																				</span>
																			)}
																		</div>
																	</div>
																</div>
															</div>
														</a>
													</Link>
												</div>
											</SessionHoverCard>
										))}
									</div>
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
