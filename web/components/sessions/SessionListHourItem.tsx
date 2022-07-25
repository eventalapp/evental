import * as Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue } from '@eventalapp/shared/utils';

import Tooltip from '../primitives/Tooltip';
import { SessionHoverCard } from './SessionHoverCard';

type SessionListHourItemProps = {
	admin?: boolean;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
	hour: string;
};

export const SessionListHourItem: React.FC<SessionListHourItemProps> = (props) => {
	const { sessions, event, admin = false, hour } = props;

	return (
		<div className="flex flex-row">
			<span className="w-24 py-2 pr-3 text-right text-sm text-gray-500">
				{dayjs(hour).format('h:mm A z')}
			</span>
			<div className="w-full">
				{sessions && event ? (
					sessions.map((session) => (
						<SessionHoverCard admin={admin} session={session} event={event} key={session.id}>
							<div className="mr-2 mb-2 inline-block">
								<Link
									href={`/events/${event.slug}${admin ? '/admin' : ''}/sessions/${session.slug}`}
								>
									<a className="inline-block">
										<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
											<div className="flex grow flex-row flex-wrap justify-between py-2 px-3">
												<div className="flex flex-row items-center justify-between">
													<div
														className="mr-3 h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full"
														style={{ backgroundColor: session?.category?.color ?? '#888888' }}
													/>
													<div>
														<span className="block text-lg leading-tight">{session.name}</span>

														<div className="flex flex-row flex-wrap space-x-3">
															{session.roleMembers.length >= 1 && (
																<span className="mt-1 text-sm text-gray-500">
																	{session.roleMembers
																		.map((member) => member.attendee.user.name)
																		.splice(0, 3)
																		.join(', ')}
																</span>
															)}

															{session?.maxAttendees !== null && (
																<Tooltip
																	side={'bottom'}
																	message={`This sessions is currently ${Math.ceil(
																		(session?.attendeeCount / session.maxAttendees) * 100
																	)}% Full (${session.attendeeCount}/${
																		session.maxAttendees
																	} attendees).`}
																>
																	<div
																		className={classNames(
																			'mt-1 inline-flex cursor-help flex-row items-center rounded-md border border-gray-200 bg-gray-50 px-1 text-sm',
																			session?.attendeeCount / session.maxAttendees <= 0.5 &&
																				'text-green-700',
																			session?.attendeeCount / session.maxAttendees > 0.5 &&
																				session?.attendeeCount / session.maxAttendees <= 0.75 &&
																				'text-orange-700',
																			session?.attendeeCount / session.maxAttendees > 0.75 &&
																				session?.attendeeCount / session.maxAttendees <= 1 &&
																				'text-red-700'
																		)}
																	>
																		<span className="text-xs">
																			{Math.ceil(
																				(session?.attendeeCount / session.maxAttendees) * 100
																			)}
																			% Full
																		</span>
																	</div>
																</Tooltip>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</a>
								</Link>
							</div>
						</SessionHoverCard>
					))
				) : (
					<Skeleton />
				)}
			</div>
		</div>
	);
};
