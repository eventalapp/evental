import Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { NotFound } from '../error/NotFound';
import Tooltip from '../primitives/Tooltip';
import { EventListItem } from './EventListItem';

type Props = { events?: Prisma.Event[]; className?: string; hidePastEvents?: boolean };

const eventListSkeleton = Array.apply(null, Array(5)).map((_, i) => (
	<div className="flex flex-row items-center py-3" key={i}>
		<div className="flex w-12 flex-col justify-center text-center md:ml-5">
			<span className="block text-center text-tiny text-gray-600">
				<Skeleton className="w-full" />
				<Skeleton className="w-full" />
			</span>
		</div>
		<Skeleton className="mx-3 min-h-[3em] min-w-[3em] rounded-md md:mx-5 md:h-16 md:w-16" />
		<div className="flex flex-col items-start w-full">
			<span className="shrink text-tiny">
				<Skeleton className="w-20" />
			</span>
			<span className="block text-lg font-medium md:text-xl w-full">
				<Skeleton className="w-full max-w-lg" />
			</span>
		</div>
	</div>
));

export const EventList: React.FC<Props> = (props) => {
	const [showPastEvents, setShowPastEvents] = useState(false);

	const { events, className, hidePastEvents } = props;

	if (events && events.length === 0) {
		return <NotFound message="No events found." />;
	}

	const previousEvents = events?.filter((event) => dayjs(event.endDate).isBefore(new Date()));
	const upcomingEvents = events?.filter((event) => dayjs(event.endDate).isAfter(new Date()));

	return (
		<div className={classNames(className)}>
			{events ? (
				<>
					{showPastEvents &&
						!hidePastEvents &&
						previousEvents &&
						previousEvents.map((event) => <EventListItem event={event} key={event.id} />)}

					{previousEvents && previousEvents.length >= 1 && !hidePastEvents && (
						<div
							className={classNames(
								'relative flex items-center',
								showPastEvents ? 'py-1.5' : 'pb-1.5'
							)}
						>
							<Tooltip
								side="top"
								message={`Click to ${showPastEvents ? 'hide' : 'show'} past events`}
							>
								<button
									className="mr-4 shrink text-gray-400"
									onClick={() => {
										setShowPastEvents(!showPastEvents);
									}}
								>
									{showPastEvents ? 'Hide' : 'Show'} Past Events
								</button>
							</Tooltip>
							<div className="grow border-t border-gray-300" />
							<span className="mx-4 shrink text-gray-400">Upcoming Events</span>
							<div className="grow border-t border-gray-300" />
						</div>
					)}

					{upcomingEvents &&
						upcomingEvents.map((event) => <EventListItem event={event} key={event.id} />)}
				</>
			) : (
				eventListSkeleton
			)}
		</div>
	);
};
