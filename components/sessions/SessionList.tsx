import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useState } from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { sessionListReducer } from '../../utils/reducer';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { HorizontalTextRule } from '../HorizontalTextRule';
import { NotFound } from '../error/NotFound';
import { SessionHoverCard } from '../radix/components/SessionHoverCard';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	admin?: boolean;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
	user: PasswordlessUser | undefined;
};

export const SessionList: React.FC<Props> = (props) => {
	const { eid, sessions, event, admin = false, user } = props;
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
		<div className="relative min-h-[25px]">
			{previousSessions && previousSessions.length >= 1 && (
				<button
					className="absolute top-0 right-0 z-20 cursor-pointer text-sm text-gray-500"
					onClick={() => {
						setShowPastEvents(!showPastEvents);
					}}
				>
					{showPastEvents ? (
						<FontAwesomeIcon
							fill="currentColor"
							className="mr-1.5 h-4 w-4"
							style={{ transform: showPastEvents ? '' : 'rotate(180deg)' }}
							icon={faEyeSlash}
						/>
					) : (
						<FontAwesomeIcon
							fill="currentColor"
							className="mr-1.5 h-4 w-4"
							style={{ transform: showPastEvents ? '' : 'rotate(180deg)' }}
							icon={faEye}
						/>
					)}
					{showPastEvents ? 'Hide' : 'Show'} past sessions
				</button>
			)}

			{previousSessions && previousSessions.length >= 1 && (
				<div
					className={classNames(
						'overflow-hidden transition-all',
						showPastEvents ? 'h-auto' : 'h-0'
					)}
				>
					{Object.entries(previousSessions.reduce(sessionListReducer, {})).map(
						([date, hourObject]) => {
							return (
								<div key={date}>
									<p className="inline-block pb-0.5 text-xl text-gray-700">
										<span className="font-medium text-gray-900">{dayjs(date).format('dddd')}</span>,{' '}
										{dayjs(date).format('MMMM D')}
									</p>
									{Object.entries(hourObject).map(([hour, sessions]) => {
										return (
											<div className="flex flex-row" key={hour}>
												<span className="w-24 py-2 pr-5 text-right text-sm text-gray-700">
													{dayjs(hour).format('h:mm A z')}
												</span>
												<div className="w-full">
													{sessions.map((session) => {
														return (
															<SessionHoverCard
																admin={admin}
																session={session}
																event={event}
																key={session.id}
																user={user}
															>
																<div className="mr-2 mb-2 inline-block">
																	<Link
																		href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${
																			session.slug
																		}`}
																	>
																		<a className="inline-block">
																			<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
																				<div className="flex flex-grow flex-row flex-wrap justify-between py-2 px-3">
																					<div className="flex flex-row items-center justify-between">
																						<div
																							className="mr-3 h-4 w-4 rounded-full"
																							style={{
																								backgroundColor: session?.type?.color ?? '#888888'
																							}}
																						/>
																						<div>
																							<span className="block text-lg leading-tight">
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

																							{admin && session?.maxAttendees !== null && (
																								<Tooltip
																									side={'bottom'}
																									message={`This sessions is currently ${Math.ceil(
																										(session?.attendeeCount /
																											session?.maxAttendees) *
																											100
																									)}% Full (${session?.attendeeCount}/${
																										session?.maxAttendees
																									} attendees).`}
																								>
																									<div className="mb-1 ml-2 inline-flex cursor-help flex-row items-center text-sm text-gray-500">
																										<p>
																											{Math.ceil(
																												(session?.attendeeCount /
																													session?.maxAttendees) *
																													100
																											)}
																											% Full
																										</p>
																									</div>
																								</Tooltip>
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

			{showPastEvents && upcomingSessions.length >= 1 && (
				<HorizontalTextRule text="Upcoming Sessions" />
			)}

			{Object.entries(upcomingSessions.reduce(sessionListReducer, {})).map(([date, hourObject]) => {
				return (
					<div key={date}>
						<p className="inline-block pb-0.5 text-xl text-gray-700">
							<span className="font-medium text-gray-900">{dayjs(date).format('dddd')}</span>,{' '}
							{dayjs(date).format('MMMM D')}
						</p>
						{Object.entries(hourObject).map(([hour, sessions]) => {
							return (
								<div className="flex flex-row" key={hour}>
									<span className="w-24 py-2 pr-5 text-right text-sm text-gray-700">
										{dayjs(hour).format('h:mm A z')}
									</span>
									<div className="w-full">
										{sessions.map((session) => (
											<SessionHoverCard
												user={user}
												admin={admin}
												session={session}
												event={event}
												key={session.id}
											>
												<div className="mr-2 mb-2 inline-block">
													<Link
														href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${session.slug}`}
													>
														<a className="inline-block">
															<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
																<div className="flex flex-grow flex-row flex-wrap justify-between py-2 px-3">
																	<div className="flex flex-row items-center justify-between">
																		<div
																			className="mr-3 h-4 w-4 rounded-full"
																			style={{ backgroundColor: session?.type?.color ?? '#888888' }}
																		/>
																		<div>
																			<span className="block text-lg leading-tight">
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

																			{admin && session?.maxAttendees !== null && (
																				<Tooltip
																					side={'bottom'}
																					message={`This sessions is currently ${Math.ceil(
																						(session?.attendeeCount / session?.maxAttendees) * 100
																					)}% Full (${session?.attendeeCount}/${
																						session?.maxAttendees
																					} attendees).`}
																				>
																					<div className="mb-1 inline-flex cursor-help flex-row items-center text-sm text-gray-500">
																						<p>
																							{Math.ceil(
																								(session?.attendeeCount / session?.maxAttendees) *
																									100
																							)}
																							% Full
																						</p>
																					</div>
																				</Tooltip>
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
