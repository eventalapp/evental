import {
	faArrowUpRightFromSquare,
	faCalendarDay,
	faClock,
	faCog,
	faHeadset,
	faLocationDot,
	faPerson,
	faRightFromBracket,
	faShare,
	faStreetView,
	faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import {
	useEvent,
	useIsAttendee,
	useIsFounder,
	useIsOrganizer,
	useUser
} from '@eventalapp/shared/hooks';
import { capitalizeOnlyFirstLetter, formatDateRange } from '@eventalapp/shared/utils';

import { EventRegistrationDialog } from '../attendees/EventRegistrationDialog';
import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip, iconLinkTooltipSkeleton } from '../primitives/IconLinkTooltip';
import { TooltipIcon, TooltipIconSkeleton } from '../primitives/TooltipIcon';
import LeaveEventDialog from './LeaveEventDialog';
import { ShareEventDropdown } from './ShareEventDropdown';

export const EventHeader: React.FC<{
	eid: string;
	adminLink?: string;
}> = (props) => {
	const { eid, adminLink = '/' } = props;
	const { data: isOrganizer } = useIsOrganizer({ eid: String(eid) });
	const { data: isFounder } = useIsFounder({ eid: String(eid) });
	const { data: event } = useEvent({ eid: String(eid) });
	const { data: user } = useUser();
	const { data: isAttendee } = useIsAttendee({ eid: String(eid) });

	return (
		<div className="relative mb-7 pt-3 sm:pt-0">
			<div className="absolute -top-5 sm:top-0 right-0 flex flex-row space-x-4">
				{event
					? isAttendee !== undefined &&
					  !isAttendee && (
							<EventRegistrationDialog event={event} user={user}>
								<IconButtonTooltip icon={faUserPlus} message="Register for this event" />
							</EventRegistrationDialog>
					  )
					: iconLinkTooltipSkeleton}

				{event && user && isOrganizer && (
					<IconLinkTooltip
						href={`/events/${event.slug}/admin${adminLink}`}
						icon={faCog}
						message={'Manage this event'}
					/>
				)}

				{event ? (
					<ShareEventDropdown event={event}>
						<IconButtonTooltip icon={faShare} message="Share this event" />
					</ShareEventDropdown>
				) : (
					iconLinkTooltipSkeleton
				)}

				{event
					? user &&
					  !isFounder &&
					  Boolean(isAttendee) && (
							<LeaveEventDialog eid={event.slug}>
								<IconButtonTooltip
									icon={faRightFromBracket}
									message="Leave this event"
									color="red"
								/>
							</LeaveEventDialog>
					  )
					: iconLinkTooltipSkeleton}
			</div>

			<div className="flex flex-row items-center">
				{event ? (
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
				) : (
					<Skeleton className="mr-3 inline-block h-16 w-16 shrink-0 rounded-md md:mr-5 md:h-20 md:w-20" />
				)}

				<div className="-mb-1 w-full">
					<Heading className="mb-1">
						{event?.name || <Skeleton className="w-full max-w-2xl" />}
					</Heading>

					<div className="flex flex-row flex-wrap items-center text-gray-600">
						{event ? (
							event.location && (
								<TooltipIcon
									icon={faLocationDot}
									tooltipMessage={`This is event is taking place at ${event?.location}.`}
									label={event?.location}
								/>
							)
						) : (
							<TooltipIconSkeleton />
						)}

						{event ? (
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
						) : (
							<TooltipIconSkeleton />
						)}

						{event ? (
							<TooltipIcon
								icon={faClock}
								tooltipMessage={`This is event is taking in the ${event.timeZone.replace(
									/_/g,
									' '
								)} timezone.`}
								label={event.timeZone.replace(/_/g, ' ')}
							/>
						) : (
							<TooltipIconSkeleton />
						)}

						{event ? (
							event.type &&
							event.type === 'IN_PERSON' && (
								<TooltipIcon
									icon={faPerson}
									tooltipMessage={`This is event is taking place in person.`}
									label={capitalizeOnlyFirstLetter(event?.type.replace('_', ' '))}
								/>
							)
						) : (
							<TooltipIconSkeleton />
						)}

						{event ? (
							event.type &&
							event.type === 'HYBRID' && (
								<TooltipIcon
									icon={faStreetView}
									tooltipMessage={`This is event is taking place virtually & in person.`}
									label={capitalizeOnlyFirstLetter(event?.type)}
								/>
							)
						) : (
							<TooltipIconSkeleton />
						)}

						{event ? (
							event.type &&
							event.type === 'VIRTUAL' && (
								<TooltipIcon
									icon={faHeadset}
									tooltipMessage={`This is event is taking place virtually.`}
									label={capitalizeOnlyFirstLetter(event?.type)}
								/>
							)
						) : (
							<TooltipIconSkeleton />
						)}

						{event && event.website && (
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
	);
};
