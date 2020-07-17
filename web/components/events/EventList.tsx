import * as Prisma from '@prisma/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { NotFound } from '../error/NotFound';
import { EventListItem } from './EventListItem';

type Props = { events?: Prisma.Event[]; className?: string; hidePastEvents?: boolean };

const eventListSkeleton = Array.apply(null, Array(12)).map((_, i) => (
	<div className="flex flex-row items-center py-3" key={i}>
		<div className="flex w-12 flex-col justify-center text-center md:ml-5">
			<span className="block text-center text-tiny text-gray-600">
				<Skeleton className="w-full" />
				<Skeleton className="w-full" />
			</span>
		</div>
		<Skeleton className="mx-3 min-h-[3em] min-w-[3em] rounded-md md:mx-5 md:h-16 md:w-16" />
		<div className="flex w-full flex-col items-start">
			<span className="shrink text-tiny">
				<Skeleton className="w-20" />
			</span>
			<span className="block w-full text-lg font-medium md:text-xl">
				<Skeleton className="w-full max-w-lg" />
			</span>
		</div>
	</div>
));

export const EventList: React.FC<Props> = (props) => {
	const { events, className, hidePastEvents = false } = props;

	if (events && events.length === 0) {
		return <NotFound message="No events found." />;
	}

	const previousEvents = events?.filter((event) => dayjs(event.endDate).isBefore(new Date()));
	const upcomingEvents = events?.filter((event) => dayjs(event.endDate).isAfter(new Date()));

	return (
		<div className={classNames('relative', className)}>
			{events ? (
				<>
					{previousEvents &&
						!hidePastEvents &&
						previousEvents.map((event) => <EventListItem event={event} key={event.id} />)}

					{previousEvents && previousEvents.length >= 1 && (
						<div className={classNames('relative flex items-center py-1.5')}>
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
