import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { UseEventsQueryData } from '../../hooks/queries/useEventsQuery';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { format } from 'date-fns';
import { NotFound } from '../NotFound';
import PageWrapper from '../layout/PageWrapper';

type Props = UseEventsQueryData;

export const EventList: React.FC<Props> = (props) => {
	const { events, isEventsLoading, eventsError } = props;

	if (isEventsLoading) {
		return <Loading />;
	}

	if (eventsError) {
		return <ViewServerError errors={[eventsError]} />;
	}

	if (!events || !events.length) {
		return <NotFound />;
	}

	return (
		<div>
			{events &&
				events.map((event, i) => (
					<div
						key={event.id}
						className={classNames(
							'hover:bg-gray-100 border-gray-200',
							i + 1 !== events.length ? 'border-b-2' : null
						)}
					>
						<Link href={`/events/${event.slug}`}>
							<a className="py-3 block">
								<div className="flex flex-row items-center">
									<div className="flex flex-col align-center justify-center w-12 md:ml-5">
										<span className="text-gray-600 text-center block text-tiny">
											{format(new Date(event.startDate), 'MMM dd')}
											<br />
											{format(new Date(event.endDate), 'MMM dd')}
										</span>
									</div>

									<div className="relative w-12 h-12 md:w-16 md:h-16 rounded-md mx-3 md:mx-5 border-2 border-gray-100">
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

									<div className="flex flex-col justify-between">
										<span className="text-gray-600 text-xs block">{event.type}</span>
										<span className="text-lg">{event.name}</span>
									</div>
								</div>
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
