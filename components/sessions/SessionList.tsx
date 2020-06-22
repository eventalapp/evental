import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { sessionListReducer } from '../../utils/reducer';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { HorizontalTextRule } from '../HorizontalTextRule';
import { NotFound } from '../error/NotFound';
import { SessionListHourItem } from './SessionListHourItem';

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
					className="absolute top-0 right-0 z-20 cursor-pointer text-sm text-gray-500 flex flex-row items-center"
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
											<SessionListHourItem
												key={hour}
												eid={String(eid)}
												sessions={sessions}
												admin={admin}
												event={event}
												user={user}
												hour={hour}
											/>
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
								<SessionListHourItem
									key={hour}
									eid={String(eid)}
									sessions={sessions}
									admin={admin}
									event={event}
									user={user}
									hour={hour}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
