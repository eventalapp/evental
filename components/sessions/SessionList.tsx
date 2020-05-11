import Link from 'next/link';
import React from 'react';
import { NotFound } from '../error/NotFound';
import classNames from 'classnames';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { formatInTimeZone } from 'date-fns-tz';
import Prisma from '@prisma/client';

type Props = {
	eid: string;
	admin?: boolean;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
};

export const SessionList: React.FC<Props> = (props) => {
	const { eid, sessions, event, admin = false } = props;

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

	if (!sessions) return null;

	if (admin) {
		return (
			<div>
				{sessions.map((session, i) => {
					return (
						<Link href={`/events/${eid}/admin/sessions/${session.slug}`} key={session.id} passHref>
							<a>
								<div
									className={classNames(
										'flex flex-row p-3 bg-white border-gray-200',
										i !== sessions.length - 1 && 'border-b-2'
									)}
								>
									<span className="text-gray-700 text-sm w-20 pr-3 text-right">
										{formatInTimeZone(
											new Date(session.startDate),
											Intl.DateTimeFormat().resolvedOptions().timeZone,
											'h:mm a zzz'
										)}
									</span>
									<div
										key={session.id}
										className="flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3 flex-wrap"
									>
										<div className="flex flex-row items-center justify-between">
											<div
												className="rounded-full mr-3 w-4 h-4"
												style={{ backgroundColor: session?.type?.color ?? '#888888' }}
											/>
											<div>
												<span className="text-lg block leading-tight">{session.name}</span>{' '}
												{session.type?.name ? (
													<span className="text-sm text-gray-500">{session.type?.name}</span>
												) : (
													<em className="text-sm text-gray-500">{'No Type'}</em>
												)}
											</div>
										</div>
									</div>
								</div>
							</a>
						</Link>
					);
				})}
			</div>
		);
	}

	return (
		<div className="mt-3">
			{sessions.map((session) => {
				return (
					<Link href={`/events/${eid}/sessions/${session.slug}`} key={session.id}>
						<a>
							<div className="flex flex-row hover:bg-gray-50 transition-all duration-100">
								<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right">
									{formatInTimeZone(new Date(session.startDate), event.timeZone, 'h:mm a zzz')}
								</span>
								<div
									key={session.id}
									className="py-2 flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3 flex-wrap"
								>
									<div className="flex flex-row items-center justify-between">
										<div
											className="rounded-full mr-3 w-4 h-4"
											style={{ backgroundColor: session?.type?.color ?? '#888888' }}
										/>
										<div>
											<span className="text-lg block leading-tight">{session.name}</span>{' '}
											{session.type?.name ? (
												<span className="text-sm text-gray-500">{session.type?.name}</span>
											) : (
												<em className="text-sm text-gray-500">{'No Type'}</em>
											)}
										</div>
									</div>
								</div>
							</div>
						</a>
					</Link>
				);
			})}
		</div>
	);
};
