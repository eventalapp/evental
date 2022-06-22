import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { SessionHoverCard } from '../radix/components/SessionHoverCard';
import Tooltip from '../radix/components/Tooltip';

type SessionListHourItemProps = {
	eid: string;
	admin?: boolean;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
	user: PasswordlessUser | undefined;
	hour: string;
};

export const SessionListHourItem: React.FC<SessionListHourItemProps> = (props) => {
	const { eid, sessions, event, admin = false, user, hour } = props;

	return (
		<div className="flex flex-row">
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
							<Link href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${session.slug}`}>
								<a className="inline-block">
									<div className="flex flex-row rounded-md transition-all duration-100 hover:bg-gray-50">
										<div className="flex grow flex-row flex-wrap justify-between py-2 px-3">
											<div className="flex flex-row items-center justify-between">
												<div
													className="mr-3 h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full"
													style={{ backgroundColor: session?.type?.color ?? '#888888' }}
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
																		'mt-1 inline-flex bg-gray-50 px-1 rounded-md cursor-help flex-row items-center text-sm border border-gray-200',
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
				))}
			</div>
		</div>
	);
};
