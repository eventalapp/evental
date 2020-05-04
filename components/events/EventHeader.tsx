import Image from 'next/image';
import React from 'react';
import Prisma from '@prisma/client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendarDay,
	faHeadset,
	faLocationDot,
	faPerson,
	faStreetView
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { capitalizeOnlyFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

export const EventHeader: React.FC<{
	event: Prisma.Event;
	eid: string;
	isOrganizer: boolean | undefined;
	isAttendee: AttendeeWithUser | undefined;
}> = (props) => {
	const { event, isOrganizer, eid, isAttendee } = props;

	return (
		<div>
			{isOrganizer && (
				<Link href={`/events/${eid}/admin`}>
					<a className="block text-white bg-primary-400 px-5 py-3 rounded-md mb-4 font-medium">
						You are an organizer for this event, click here to manage this event
					</a>
				</Link>
			)}

			{!Boolean(isAttendee) && (
				<Link href={`/events/${eid}/register`}>
					<a className="block text-white bg-primary-400 px-5 py-3 rounded-md mb-4 font-medium">
						Are you attending this event? Register here.
					</a>
				</Link>
			)}

			<div className="flex flex-row items-center mb-1">
				<div className="flex-shrink-0 relative w-12 h-12 md:w-20 md:h-20 rounded-md mr-3 md:mr-5 border-2 border-gray-100">
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

				<div>
					<span className="text-gray-500 text-xs block">{event?.category}</span>
					<h1 className="text-3xl font-bold leading-tight">{event?.name}</h1>

					<div className="flex-row flex mb-1 items-center text-gray-600 flex-wrap">
						{event?.location && (
							<div className="flex flex-row items-center mr-3">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faLocationDot}
								/>
								<p>{event?.location}</p>
							</div>
						)}

						<div className="flex flex-row items-center mr-3">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faCalendarDay}
							/>
							<p>
								{format(new Date(event.startDate), 'MMMM dd')} -{' '}
								{format(new Date(event.endDate), 'MMMM dd')}
							</p>
						</div>

						{event?.type && event.type === 'IN_PERSON' && (
							<div className="flex flex-row items-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faPerson}
								/>
								<p>{capitalizeOnlyFirstLetter(event?.type.replace('_', ' '))}</p>
							</div>
						)}

						{event?.type && event.type === 'HYBRID' && (
							<div className="flex flex-row items-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faStreetView}
								/>
								<p>{capitalizeOnlyFirstLetter(event?.type)}</p>
							</div>
						)}

						{event?.type && event.type === 'VIRTUAL' && (
							<div className="flex flex-row items-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faHeadset}
								/>
								<p>{capitalizeOnlyFirstLetter(event?.type)}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
