import Prisma from '@prisma/client';
import classNames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = { events?: Prisma.Event[]; className?: string };

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
	const { events, className } = props;

	if (events && events.length === 0) {
		return <NotFound message="No events found." />;
	}

	return (
		<div className={classNames(className)}>
			{events
				? events.map((event) => (
						<div key={event.id}>
							<div className="-mx-1 rounded-md hover:bg-gray-75">
								<Link href={`/events/${event.slug}`}>
									<a className="block py-3">
										<div className="flex flex-row items-center">
											<div className="flex w-12 flex-col justify-center text-center md:ml-5">
												<Tooltip
													side={'top'}
													message={`This is event is taking place from ${formatInTimeZone(
														new Date(event.startDate),
														Intl.DateTimeFormat().resolvedOptions().timeZone,
														'MMMM do'
													)} to ${formatInTimeZone(
														new Date(event.endDate),
														Intl.DateTimeFormat().resolvedOptions().timeZone,
														'MMMM do  zzz'
													)}.`}
												>
													<span className="block text-center text-tiny text-gray-600">
														{formatInTimeZone(
															new Date(event.startDate),
															Intl.DateTimeFormat().resolvedOptions().timeZone,
															'MMM dd'
														)}
														<br />
														{formatInTimeZone(
															new Date(event.endDate),
															Intl.DateTimeFormat().resolvedOptions().timeZone,
															'MMM dd'
														)}
													</span>
												</Tooltip>
											</div>
											<div className="relative mx-3 min-h-[3em] min-w-[3em] rounded-md md:mx-5 md:h-16 md:w-16">
												<Image
													alt={event.name}
													src={
														event.image
															? `https://cdn.evental.app${event.image}`
															: `https://cdn.evental.app/images/default-event.jpg`
													}
													layout="fill"
													className="rounded-md"
												/>
											</div>
											<div className="flex flex-col items-start">
												<Tooltip
													side={'top'}
													message={`This is a ${event?.category?.toLowerCase()} event.`}
												>
													<span className="inline-block shrink text-tiny font-medium text-gray-500">
														{event.category}
													</span>
												</Tooltip>
												<span className="block text-lg font-medium md:text-xl">{event.name}</span>
											</div>
										</div>
									</a>
								</Link>
							</div>
						</div>
				  ))
				: eventListSkeleton}
		</div>
	);
};
