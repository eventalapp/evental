import Link from 'next/link';
import React, { useState } from 'react';
import { NotFound } from '../error/NotFound';
import classNames from 'classnames';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import Prisma from '@prisma/client';
import dayjs from 'dayjs';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../radix/components/shared/Button';

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

	return (
		<div className="mt-3">
			{previousSessions && (
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
							className="ml-1 w-5 h-5 text-gray-600 transition-all duration-200"
							size="1x"
							style={{ transform: showPastEvents ? 'rotate(180deg)' : '' }}
							icon={faChevronUp}
						/>
					</Button>

					<div
						className={classNames(
							'transition-all overflow-hidden',
							showPastEvents ? 'h-auto' : 'h-0'
						)}
					>
						{Object.entries(
							sessions
								.filter((session) => dayjs(session.endDate).isBefore(new Date()))
								.reduce((acc: Record<string, Record<string, SessionWithVenue[]>>, session) => {
									const day = dayjs(session.startDate).format('YYYY/MM/DD');
									const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

									if (!acc[day]) {
										acc[day] = {};
									}

									if (!acc[day][hour]) {
										acc[day][hour] = [];
									}

									acc[day][hour].push(session);

									return acc;
								}, {})
						).map(([date, hourObject]) => {
							return (
								<div key={date}>
									<p className="text-xl mt-2 pb-0.5 border-b-2 px-2 border-gray-200 inline-block">
										{dayjs(date).format('dddd, MMM D')}
									</p>
									{Object.entries(hourObject).map(([hour, sessions]) => {
										return (
											<div className="flex flex-row">
												<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right border-r-2 border-gray-200">
													{dayjs(hour).format('h:mm A z')}
												</span>
												<div>
													{sessions.map((session) => (
														<Link
															href={`/events/${eid}${admin && '/admin'}/sessions/${session.slug}`}
															key={session.id}
														>
															<a className="mr-2 mb-2 inline-block">
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
																					<em className="text-sm text-gray-500">{'No Type'}</em>
																				)}
																			</div>
																		</div>
																	</div>
																</div>
															</a>
														</Link>
													))}
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</>
			)}

			{Object.entries(
				sessions
					.filter((session) => dayjs(session.endDate).isAfter(new Date()))
					.reduce((acc: Record<string, Record<string, SessionWithVenue[]>>, session) => {
						const day = dayjs(session.startDate).format('YYYY/MM/DD');
						const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

						if (!acc[day]) {
							acc[day] = {};
						}

						if (!acc[day][hour]) {
							acc[day][hour] = [];
						}

						acc[day][hour].push(session);

						return acc;
					}, {})
			).map(([date, hourObject]) => {
				return (
					<div key={date}>
						<p className="text-xl mt-2 pb-0.5 border-b-2 px-2 border-gray-200 inline-block">
							{dayjs(date).format('dddd, MMM D')}
						</p>
						{Object.entries(hourObject).map(([hour, sessions]) => {
							return (
								<div className="flex flex-row">
									<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right border-r-2 border-gray-200">
										{dayjs(hour).format('h:mm A z')}
									</span>
									<div className="w-full">
										{sessions.map((session) => (
											<Link
												href={`/events/${eid}${admin ? '/admin' : ''}/sessions/${session.slug}`}
												key={session.id}
											>
												<a className="mr-2 mb-2 inline-block">
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
																	</span>{' '}
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
