import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { sessionListReducer } from '../../utils/reducer';
import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';
import { SessionListDateItem } from './SessionListDateItem';

type Props = {
	admin?: boolean;
	sessions?: SessionWithVenue[];
	event?: Prisma.Event;
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
	const { sessions, event, admin = false } = props;
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
			{previousSessions && event && previousSessions.length >= 1 && (
				<div
					className={classNames(
						'overflow-hidden transition-all',
						showPastEvents ? 'h-auto' : 'h-0'
					)}
				>
					{Object.entries(previousSessions.reduce(sessionListReducer, {})).map(
						([date, sessionsByHour]) => {
							return (
								<SessionListDateItem
									date={date}
									sessionsByHour={sessionsByHour}
									event={event}
									key={date}
									admin={admin}
								/>
							);
						}
					)}
				</div>
			)}

			{previousSessions && previousSessions.length >= 1 && (
				<div
					className={classNames('relative flex items-center', showPastEvents ? 'py-1.5' : 'pb-1.5')}
				>
					<Tooltip
						side="top"
						message={`Click to ${showPastEvents ? 'hide' : 'show'} past sessions`}
					>
						<button
							className="mr-4 shrink text-gray-400"
							onClick={() => {
								setShowPastEvents(!showPastEvents);
							}}
						>
							{showPastEvents ? 'Hide' : 'Show'} Past Sessions
						</button>
					</Tooltip>
					<div className="grow border-t border-gray-300" />
					<span className="mx-4 shrink text-gray-400">Upcoming Sessions</span>
					<div className="grow border-t border-gray-300" />
				</div>
			)}

			{upcomingSessions && event
				? Object.entries(upcomingSessions.reduce(sessionListReducer, {})).map(
						([date, sessionsByHour]) => {
							return (
								<SessionListDateItem
									date={date}
									sessionsByHour={sessionsByHour}
									event={event}
									key={date}
									admin={admin}
								/>
							);
						}
				  )
				: sessionListSkeleton}
		</div>
	);
};
