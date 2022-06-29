import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { sessionListReducer } from '../../utils/reducer';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { HorizontalTextRule } from '../HorizontalTextRule';
import { NotFound } from '../error/NotFound';
import { SessionListHourItem } from './SessionListHourItem';

type Props = {
	eid: string;
	admin?: boolean;
	sessions?: SessionWithVenue[];
	event?: Prisma.Event;
	user: PasswordlessUser | undefined;
};

const sessionListSkeleton = Array.apply(null, Array(5)).map((_, i) => (
	<div className="mb-4" key={i}>
		<Skeleton className="w-48 mb-2 h-5" />
		<div className="flex flex-row mb-3">
			<Skeleton className="w-24 mr-5 h-6" />
			<div className="w-full flex-row flex flex-wrap">
				<Skeleton className="w-48 mr-3 h-6 mb-2" />
				<Skeleton className="w-48 mr-3 h-6 mb-2" />
				<Skeleton className="w-48 mr-3 h-6 mb-2" />
			</div>
		</div>
	</div>
));

export const SessionList: React.FC<Props> = (props) => {
	const { eid, sessions, event, admin = false, user } = props;
	const [showPastEvents, setShowPastEvents] = useState(false);

	const previousSessions = sessions?.filter((session) =>
		dayjs(session.endDate).isBefore(new Date())
	);
	const upcomingSessions = sessions?.filter((session) =>
		dayjs(session.endDate).isAfter(new Date())
	);

	if (sessions && sessions?.length === 0) {
		return <NotFound message="No sessions found." />;
	}

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

			{previousSessions && event && previousSessions.length >= 1 && (
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

			{showPastEvents && upcomingSessions && upcomingSessions.length >= 1 && (
				<HorizontalTextRule text="Upcoming Sessions" />
			)}

			{upcomingSessions && event
				? Object.entries(upcomingSessions.reduce(sessionListReducer, {})).map(
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
				  )
				: sessionListSkeleton}
		</div>
	);
};
