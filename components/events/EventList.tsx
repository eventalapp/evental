import Prisma from '@prisma/client';
import classNames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = { events: Prisma.Event[]; className?: string };

export const EventList: React.FC<Props> = (props) => {
	const { events, className } = props;

	if (events && events.length === 0) {
		return <NotFound message="No events found." />;
	}

	return (
		<div className={classNames(className)}>
			{events &&
				events.map((event, i) => (
					<div
						key={event.id}
						className={classNames('border-gray-100', i + 1 !== events.length ? 'border-b-2' : null)}
					>
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
										<div className="relative mx-3 min-h-[3em] min-w-[3em] rounded-md border border-gray-100 md:mx-5 md:h-16 md:w-16">
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
				))}
		</div>
	);
};
