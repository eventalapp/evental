import {
	faArrowRight,
	faCalendarDay,
	faLocationDot,
	faRightFromBracket,
	faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Prisma from '@prisma/client';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import cx from 'classnames';
import dayjs from 'dayjs';
import { htmlToText } from 'html-to-text';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useIsSessionAttendee, useUser } from '@eventalapp/shared/hooks';
import { SessionWithVenue, StrippedUser, formatDateRange } from '@eventalapp/shared/utils';
import { faCalendarCirclePlus } from '@eventalapp/shared/utils/icons';

import { useCreateSessionAttendee } from '../../hooks/mutations/useCreateSessionAttendee';
import Tooltip from '../primitives/Tooltip';
import { TooltipIcon } from '../primitives/TooltipIcon';
import { LeaveSessionDialog } from './LeaveSessionDialog';

interface Props {
	event: Prisma.Event;
	session: SessionWithVenue;
	admin?: boolean;
	redirect?: boolean;
}

type AttendThisSessionProps = Props & { user: StrippedUser | undefined };

const AttendThisSession: React.FC<AttendThisSessionProps> = (props) => {
	const { event, session, redirect, user } = props;

	const { data: isSessionAttendee, isLoading: isSessionAttendeeLoading } = useIsSessionAttendee({
		eid: event.slug,
		sid: session.slug
	});
	const { createSessionAttendeeMutation } = useCreateSessionAttendee(
		event.slug,
		session.slug,
		user?.id
	);

	if (isSessionAttendeeLoading) {
		return (
			<div>
				<Skeleton className="h-6 w-6" />
			</div>
		);
	}

	if (user && !isSessionAttendee) {
		return (
			<Tooltip side={'right'} message={`Add the ${session.name} session to your schedule`}>
				<button
					onClick={() => {
						createSessionAttendeeMutation.mutate();
					}}
				>
					<FontAwesomeIcon
						fill="currentColor"
						className="h-6 w-6 cursor-pointer text-gray-500"
						size="lg"
						icon={faCalendarCirclePlus}
					/>
				</button>
			</Tooltip>
		);
	}

	if (user && isSessionAttendee) {
		return (
			<LeaveSessionDialog eid={event.slug} sid={session.slug} redirect={redirect}>
				<div className="flex items-center justify-center">
					<Tooltip side={'right'} message={'Leave this session'}>
						<button type="button">
							<FontAwesomeIcon
								fill="currentColor"
								className="block h-5 w-5 text-red-500"
								size="1x"
								icon={faRightFromBracket}
							/>
						</button>
					</Tooltip>
				</div>
			</LeaveSessionDialog>
		);
	}

	return null;
};

export const SessionHoverCard: React.FC<Props> = (props) => {
	const { data: user } = useUser();
	const { children, session, event, admin, redirect = true } = props;

	const descriptionAsText = htmlToText(session.description ?? '');

	return (
		<HoverCardPrimitive.Root openDelay={150} closeDelay={150}>
			<HoverCardPrimitive.Trigger asChild>{children}</HoverCardPrimitive.Trigger>
			<HoverCardPrimitive.Content
				side={'top'}
				align="center"
				sideOffset={4}
				className={cx(
					'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
					'max-w-xl rounded-lg p-4 pr-14 md:w-full',
					'border border-gray-200 bg-white shadow dark:bg-gray-800',
					'relative min-w-[350px] overflow-hidden focus:outline-none focus:ring focus:ring-gray-900 focus:ring-opacity-75'
				)}
			>
				<HoverCardPrimitive.Arrow
					className="fill-current text-gray-200 dark:text-gray-800"
					offset={10}
				/>

				<div className="h-full w-full">
					<div className="absolute right-3.5 top-3.5 flex flex-col items-end justify-end">
						<Tooltip side={'right'} message={`View session`}>
							<div className="mb-3">
								<Link
									href={`/events/${event.slug}${admin ? '/admin' : ''}/sessions/${session.slug}`}
									passHref
								>
									<a>
										<FontAwesomeIcon
											fill="currentColor"
											className="h-6 w-6 cursor-pointer text-gray-500"
											size="lg"
											icon={faArrowRight}
										/>
									</a>
								</Link>
							</div>
						</Tooltip>

						<AttendThisSession event={event} session={session} user={user} redirect={redirect} />
					</div>

					<h3 className="text-lg font-bold leading-[1.3] tracking-tight md:text-xl">
						{session.name}
					</h3>

					{session.description && (
						<p className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
							{descriptionAsText.substring(0, 300)}
							{descriptionAsText.length > 300 && '...'}
						</p>
					)}

					<div className="mt-3 mb-0.5 flex flex-row flex-wrap items-center text-gray-600">
						{session.category && (
							<TooltipIcon
								customIcon={
									<div
										className="mr-1.5 h-3 w-3 rounded-full"
										style={{ backgroundColor: session.category.color ?? '#888888' }}
									/>
								}
								link={`/events/${event.slug}${admin ? '/admin' : ''}/sessions/categories/${
									session.category.slug
								}`}
								tooltipMessage={`This session is a part of the ${session.category.name} category.`}
								label={session.category.name}
							/>
						)}

						<TooltipIcon
							icon={faCalendarDay}
							tooltipMessage={`This is session is taking place on ${formatDateRange(
								new Date(session.startDate),
								new Date(session.endDate)
							)}.`}
							link={`/events/${event.slug}/sessions/dates/${dayjs(session.startDate).format(
								'YYYY-MM-DD'
							)}`}
							label={formatDateRange(new Date(session.startDate), new Date(session.endDate))}
						/>

						{session.venue && (
							<TooltipIcon
								icon={faLocationDot}
								link={`/events/${event.slug}${admin ? '/admin' : ''}/venues/${session.venue.slug}`}
								tooltipMessage={`This session is taking place at the ${session?.venue?.name} venue.`}
								label={session?.venue?.name}
							/>
						)}

						{session?.maxAttendees !== null && (
							<TooltipIcon
								icon={faUserGroup}
								tooltipMessage={`This sessions is currently ${Math.ceil(
									(session?.attendeeCount / session?.maxAttendees) * 100
								)}% Full (${session?.attendeeCount}/${session?.maxAttendees} attendees).`}
								label={`${Math.ceil((session?.attendeeCount / session?.maxAttendees) * 100)}% Full`}
							/>
						)}
					</div>

					{session.roleMembers && session.roleMembers.length > 0 && (
						<ul className="mt-4 grid grid-cols-4 gap-2">
							{session.roleMembers.slice(0, 4).map((roleMember) => (
								<Tooltip
									message={`View ${roleMember.attendee.user.name}'s profile`}
									key={roleMember.attendee.id}
								>
									<li className="relative flex h-full flex-col items-center justify-between">
										<Link
											href={`/events/${event.slug}${admin ? '/admin' : ''}/attendees/${
												roleMember.attendee.user.slug
											}`}
										>
											<a className="flex h-full flex-col items-center justify-start">
												<div className="relative mb-1 h-14 w-14 rounded-md border border-gray-200 shadow-sm">
													<Image
														alt={String(roleMember.attendee.user.name)}
														src={String(
															roleMember.attendee?.user.image
																? `https://cdn.evental.app${roleMember.attendee?.user.image}`
																: `https://cdn.evental.app/images/default-avatar.jpg`
														)}
														className="rounded-md"
														layout="fill"
													/>
												</div>
												<span className="text-center text-sm">{roleMember.attendee.user.name}</span>
											</a>
										</Link>
									</li>
								</Tooltip>
							))}
						</ul>
					)}
				</div>
			</HoverCardPrimitive.Content>
		</HoverCardPrimitive.Root>
	);
};
