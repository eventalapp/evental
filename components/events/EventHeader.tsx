import {
	faArrowUpRightFromSquare,
	faCalendarDay,
	faClock,
	faHeadset,
	faLocationDot,
	faPerson,
	faRightFromBracket,
	faShare,
	faStreetView
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { theme } from '../../tailwind.config';
import { formatDateRange } from '../../utils/formatDateRange';
import { capitalizeOnlyFirstLetter } from '../../utils/string';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import LeaveEventDialog from '../radix/components/LeaveEventDialog';
import { ShareDropdown } from '../radix/components/ShareDropdown';
import Tooltip from '../radix/components/Tooltip';

export const EventHeader: React.FC<{
	event: Prisma.Event;
	eid: string;
	isOrganizer: boolean | undefined;
	isAttendee: boolean | undefined;
	adminLink?: string | undefined;
	user: PasswordlessUser | undefined;
}> = (props) => {
	const { user, event, isOrganizer, eid, isAttendee, adminLink = '/' } = props;

	return (
		<div className="mb-7">
			{user && isOrganizer && (
				<Link href={`/events/${eid}/admin${adminLink}`}>
					<a
						className="block text-white px-5 py-3 rounded-md mb-4 font-medium"
						style={{
							backgroundColor: event.color ?? theme.extend.colors.primary.DEFAULT
						}}
					>
						You are an organizer for this event, click here to manage this event
					</a>
				</Link>
			)}

			{user && !Boolean(isAttendee) && (
				<Link href={`/events/${eid}/register`}>
					<a
						className="block text-white px-5 py-3 rounded-md mb-4 font-medium"
						style={{
							backgroundColor: event.color ?? theme.extend.colors.primary.DEFAULT
						}}
					>
						Are you attending this event? Register here.
					</a>
				</Link>
			)}

			<div className="relative">
				<div className="top-0 right-0 absolute flex flex-row">
					<ShareDropdown event={event}>
						<div>
							<Tooltip side={'top'} message={'Share this event.'}>
								<button type="button" className="w-6 h-6">
									<FontAwesomeIcon
										fill="currentColor"
										className="h-5 w-5"
										style={{
											color: event.color ?? theme.extend.colors.primary.DEFAULT
										}}
										size="1x"
										icon={faShare}
									/>
								</button>
							</Tooltip>
						</div>
					</ShareDropdown>

					{user && Boolean(isAttendee) && (
						<LeaveEventDialog eventSlug={event.slug} userSlug={String(user?.slug)}>
							<div className="ml-5">
								<Tooltip side={'top'} message={'Leave this event.'}>
									<button type="button" className="w-6 h-6">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5 text-red-500"
											size="1x"
											icon={faRightFromBracket}
										/>
									</button>
								</Tooltip>
							</div>
						</LeaveEventDialog>
					)}
				</div>

				<div className="flex flex-row items-center">
					<div className="flex-shrink-0 relative w-16 h-16 md:w-20 md:h-20 mr-3 md:mr-5 border border-gray-200 shadow-sm rounded-md">
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
						<h1 className="text-2xl md:text-3xl font-bold max-w-lg tracking-tight leading-[1.1] mb-1.5">
							{event?.name}
						</h1>

						<div className="flex-row flex items-center text-gray-600 flex-wrap">
							{event?.location && (
								<Tooltip message={`This is event is taking place at ${event?.location}.`}>
									<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
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
								message={`This is event is taking place from ${formatDateRange(
									new Date(event.startDate),
									new Date(event.endDate),
									{
										showHour: false
									}
								)}.`}
							>
								<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
									<FontAwesomeIcon
										fill="currentColor"
										className="w-5 h-5 mr-1.5"
										size="1x"
										icon={faCalendarDay}
									/>
									<p>
										{formatDateRange(new Date(event.startDate), new Date(event.endDate), {
											showHour: false
										})}
									</p>
								</div>
							</Tooltip>

							<Tooltip
								message={`This is event is taking in the ${event.timeZone.replace(
									/_/g,
									' '
								)} timezone.`}
							>
								<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
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
									<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
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
									<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
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
									<div className="flex flex-row items-center cursor-help mr-3 mb-1 text-sm md:text-base">
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
										<div className="flex flex-row items-center cursor-pointer text-sm md:text-base">
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
