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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useEventQuery } from '../../hooks/queries/useEventQuery';
import { useIsAttendeeQuery } from '../../hooks/queries/useIsAttendeeQuery';
import { useIsOrganizerQuery } from '../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../hooks/queries/useUser';
import { formatDateRange } from '../../utils/formatDateRange';
import { capitalizeOnlyFirstLetter } from '../../utils/string';
import { TooltipIcon, TooltipIconSkeleton } from '../TooltipIcon';
import { CreateAttendeeDialog } from '../radix/components/CreateAttendeeDialog';
import LeaveEventDialog from '../radix/components/LeaveEventDialog';
import { ShareEventDropdown } from '../radix/components/ShareEventDropdown';
import Tooltip from '../radix/components/Tooltip';
import { Heading } from '../typography/Heading';

export const EventHeader: React.FC<{
	eid: string;
	adminLink?: string;
}> = (props) => {
	const { eid, adminLink = '/' } = props;
	const { isOrganizer } = useIsOrganizerQuery(String(eid));
	const { event } = useEventQuery(String(eid));
	const { user } = useUser();
	const { isAttendee } = useIsAttendeeQuery(String(eid));

	return (
		<div className="mb-7">
			<div className="relative">
				<div className="absolute top-0 right-0 flex flex-row">
					{event ? (
						!isAttendee && (
							<CreateAttendeeDialog event={event} user={user}>
								<div className="ml-4">
									<Tooltip side={'top'} message={'Are you attending this event? Click to register'}>
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
						)
					) : (
						<Skeleton className="w-6 h-6 ml-4 inline-block" />
					)}

					{event && user && isOrganizer && (
						<Link href={`/events/${event.slug}/admin${adminLink}`}>
							<a className="ml-4">
								<Tooltip
									side={'top'}
									message={'You are an organizer for this event, click here to manage this event'}
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

					{event ? (
						<ShareEventDropdown event={event}>
							<div className="ml-4">
								<Tooltip side={'top'} message={'Share this event'}>
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
						</ShareEventDropdown>
					) : (
						<Skeleton className="w-6 h-6 ml-4 inline-block" />
					)}

					{event ? (
						user &&
						Boolean(isAttendee) && (
							<LeaveEventDialog eventSlug={event.slug} userSlug={String(user?.slug)}>
								<div className="ml-4">
									<Tooltip side={'top'} message={'Leave this event'}>
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
						)
					) : (
						<Skeleton className="w-6 h-6 ml-4 inline-block" />
					)}
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
						<Skeleton className="mr-3 h-16 w-16 rounded-md shrink-0 md:h-20 md:w-20 md:mr-5 inline-block" />
					)}

					<div className="-mb-1 w-full">
						<Heading className="mb-1">
							{event?.name || <Skeleton className="max-w-2xl w-full" />}
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
		</div>
	);
};
