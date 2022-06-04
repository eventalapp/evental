import {
	faArrowRightFromBracket,
	faArrowUpRightFromSquare,
	faCalendarDay,
	faClock,
	faHeadset,
	faLocationDot,
	faPerson,
	faStreetView
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useLeaveEvent } from '../../hooks/mutations/useLeaveEvent';
import { capitalizeOnlyFirstLetter } from '../../utils/string';
import { AttendeeWithUser, PasswordlessUser } from '../../utils/stripUserPassword';
import Tooltip from '../radix/components/Tooltip';

export const EventHeader: React.FC<{
	event: Prisma.Event;
	eid: string;
	isOrganizer: boolean | undefined;
	isAttendee: AttendeeWithUser | undefined;
	adminLink?: string | undefined;
	user: PasswordlessUser | undefined;
}> = (props) => {
	const { user, event, isOrganizer, eid, isAttendee, adminLink = '/' } = props;

	const leaveEventMutation = useLeaveEvent(event.slug, String(user?.slug));

	return (
		<div className="mb-7">
			{user && isOrganizer && (
				<Link href={`/events/${eid}/admin${adminLink}`}>
					<a className="bg-primary block text-white px-5 py-3 rounded-md mb-4 font-medium">
						You are an organizer for this event, click here to manage this event
					</a>
				</Link>
			)}

			{user && !Boolean(isAttendee) && (
				<Link href={`/events/${eid}/register`}>
					<a className="bg-primary block text-white px-5 py-3 rounded-md mb-4 font-medium">
						Are you attending this event? Register here.
					</a>
				</Link>
			)}

			<div className="relative">
				{user && Boolean(isAttendee) && (
					<div className="top-0 right-0 absolute">
						<Tooltip side={'top'} message={'Leave this event.'}>
							<button
								onClick={() => {
									leaveEventMutation.mutate();
								}}
							>
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 h-5 w-5 text-red-500"
									size="1x"
									icon={faArrowRightFromBracket}
								/>
							</button>
						</Tooltip>
					</div>
				)}
				<div className="flex flex-row items-center">
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
						<Tooltip side={'top'} message={`This is a ${event?.category?.toLowerCase()} event.`}>
							<span className="text-gray-500 text-xs font-medium inline-block cursor-help">
								{event?.category}
							</span>
						</Tooltip>

						<h1 className="text-2xl md:text-3xl font-bold max-w-lg tracking-tight leading-[1.1] mb-1.5">
							{event?.name}
						</h1>

						<div className="flex-row flex items-center text-gray-600 flex-wrap space-x-3">
							{event?.location && (
								<Tooltip message={`This is event is taking place at ${event?.location}.`}>
									<div className="flex flex-row items-center cursor-help">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faLocationDot}
										/>
										<p>{event?.location}</p>
									</div>
								</Tooltip>
							)}

							<Tooltip
								message={`This is event is taking place from ${formatInTimeZone(
									new Date(event.startDate),
									Intl.DateTimeFormat().resolvedOptions().timeZone,
									'MMMM do'
								)} to ${formatInTimeZone(
									new Date(event.endDate),
									Intl.DateTimeFormat().resolvedOptions().timeZone,
									'MMMM do zzz'
								)}.`}
							>
								<div className="flex flex-row items-center cursor-help">
									<FontAwesomeIcon
										fill="currentColor"
										className="w-5 h-5 mr-1.5"
										size="1x"
										icon={faCalendarDay}
									/>
									<p>
										{formatInTimeZone(
											new Date(event.startDate),
											Intl.DateTimeFormat().resolvedOptions().timeZone,
											'MMMM do'
										)}{' '}
										-{' '}
										{formatInTimeZone(
											new Date(event.endDate),
											Intl.DateTimeFormat().resolvedOptions().timeZone,
											'MMMM do'
										)}
									</p>
								</div>
							</Tooltip>

							<Tooltip
								message={`This is event is taking in the ${event.timeZone.replace(
									/_/g,
									' '
								)} timezone.`}
							>
								<div className="flex flex-row items-center cursor-help">
									<FontAwesomeIcon
										fill="currentColor"
										className="w-5 h-5 mr-1.5"
										size="1x"
										icon={faClock}
									/>
									<p>{event.timeZone.replace(/_/g, ' ')}</p>
								</div>
							</Tooltip>

							{event?.type && event.type === 'IN_PERSON' && (
								<Tooltip message={`This is event is taking place in person.`}>
									<div className="flex flex-row items-center cursor-help">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faPerson}
										/>
										<p>{capitalizeOnlyFirstLetter(event?.type.replace('_', ' '))}</p>
									</div>
								</Tooltip>
							)}

							{event?.type && event.type === 'HYBRID' && (
								<Tooltip message={`This is event is taking place virtually & in person.`}>
									<div className="flex flex-row items-center cursor-help">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faStreetView}
										/>
										<p>{capitalizeOnlyFirstLetter(event?.type)}</p>
									</div>
								</Tooltip>
							)}

							{event?.type && event.type === 'VIRTUAL' && (
								<Tooltip message={`This is event is taking place virtually.`}>
									<div className="flex flex-row items-center cursor-help">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faHeadset}
										/>
										<p>{capitalizeOnlyFirstLetter(event?.type)}</p>
									</div>
								</Tooltip>
							)}

							{event.website && (
								<Tooltip message={`This is event's website is ${event.website}.`}>
									<a href={event.website} target="_blank" rel="noopener noreferrer">
										<div className="flex flex-row items-center cursor-pointer">
											<FontAwesomeIcon
												fill="currentColor"
												className="w-5 h-5 mr-1.5"
												size="1x"
												icon={faArrowUpRightFromSquare}
											/>
											<p>{event.website}</p>
										</div>
									</a>
								</Tooltip>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
