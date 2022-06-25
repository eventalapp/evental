import {
	faArrowUpRightFromSquare,
	faCalendarDay,
	faClock,
	faCog,
	faFilter,
	faHeadset,
	faLocationDot,
	faPerson,
	faRightFromBracket,
	faShare,
	faStreetView,
	faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { formatDateRange } from '../../utils/formatDateRange';
import { capitalizeOnlyFirstLetter } from '../../utils/string';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { TooltipIcon } from '../TooltipIcon';
import { CreateAttendeeDialog } from '../radix/components/CreateAttendeeDialog';
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
			<div className="relative">
				<div className="absolute top-0 right-0 flex flex-row">
					<div>
						<Tooltip side={'top'} message={'Filter sessions.'}>
							<button type="button" className="h-6 w-6 text-gray-700">
								<FontAwesomeIcon
									fill="currentColor"
									className="h-5 w-5"
									size="1x"
									icon={faFilter}
								/>
							</button>
						</Tooltip>
					</div>

					{!Boolean(isAttendee) && (
						<CreateAttendeeDialog event={event} user={user}>
							<div className="ml-4">
								<Tooltip side={'top'} message={'Are you attending this event? Click to register.'}>
									<button type="button" className="h-6 w-6 text-gray-700">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5"
											size="1x"
											icon={faUserPlus}
										/>
									</button>
								</Tooltip>
							</div>
						</CreateAttendeeDialog>
					)}

					{user && isOrganizer && (
						<Link href={`/events/${eid}/admin${adminLink}`}>
							<a className="ml-4">
								<Tooltip
									side={'top'}
									message={'You are an organizer for this event, click here to manage this event.'}
								>
									<button type="button" className="h-6 w-6 text-gray-700">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5"
											size="1x"
											icon={faCog}
										/>
									</button>
								</Tooltip>
							</a>
						</Link>
					)}

					<ShareDropdown event={event}>
						<div className="ml-4">
							<Tooltip side={'top'} message={'Share this event.'}>
								<button type="button" className="h-6 w-6 text-gray-700">
									<FontAwesomeIcon
										fill="currentColor"
										className="h-5 w-5"
										size="1x"
										icon={faShare}
									/>
								</button>
							</Tooltip>
						</div>
					</ShareDropdown>

					{user && Boolean(isAttendee) && (
						<LeaveEventDialog eventSlug={event.slug} userSlug={String(user?.slug)}>
							<div className="ml-4">
								<Tooltip side={'top'} message={'Leave this event.'}>
									<button type="button" className="h-6 w-6">
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
					<div className="relative mr-3 h-16 w-16 shrink-0 rounded-md md:mr-5 md:h-20 md:w-20">
						<Link href={`/events/${event.slug}`}>
							<a>
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
							</a>
						</Link>
					</div>

					<div>
						<h1 className="mb-1.5 max-w-lg text-2xl font-bold leading-[1.1] tracking-tight md:text-3xl">
							{event?.name}
						</h1>

						<div className="flex flex-row flex-wrap items-center text-gray-600">
							{event?.location && (
								<TooltipIcon
									icon={faLocationDot}
									tooltipMessage={`This is event is taking place at ${event?.location}.`}
									label={event?.location}
								/>
							)}

							<TooltipIcon
								icon={faCalendarDay}
								tooltipMessage={`This is event is taking place from ${formatDateRange(
									new Date(event.startDate),
									new Date(event.endDate),
									{
										showHour: false
									}
								)}.`}
								label={formatDateRange(new Date(event.startDate), new Date(event.endDate), {
									showHour: false
								})}
							/>

							<TooltipIcon
								icon={faClock}
								tooltipMessage={`This is event is taking in the ${event.timeZone.replace(
									/_/g,
									' '
								)} timezone.`}
								label={event.timeZone.replace(/_/g, ' ')}
							/>

							{event?.type && event.type === 'IN_PERSON' && (
								<TooltipIcon
									icon={faPerson}
									tooltipMessage={`This is event is taking place in person.`}
									label={capitalizeOnlyFirstLetter(event?.type.replace('_', ' '))}
								/>
							)}

							{event?.type && event.type === 'HYBRID' && (
								<TooltipIcon
									icon={faStreetView}
									tooltipMessage={`This is event is taking place virtually & in person.`}
									label={capitalizeOnlyFirstLetter(event?.type)}
								/>
							)}

							{event?.type && event.type === 'VIRTUAL' && (
								<TooltipIcon
									icon={faHeadset}
									tooltipMessage={`This is event is taking place virtually.`}
									label={capitalizeOnlyFirstLetter(event?.type)}
								/>
							)}

							{event.website && (
								<TooltipIcon
									icon={faArrowUpRightFromSquare}
									tooltipMessage={`This is event's website is ${event.website}.`}
									label={event.website}
									externalLink={event.website}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
