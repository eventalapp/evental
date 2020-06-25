import {
	faCalendarDay,
	faLocationDot,
	faPenToSquare,
	faRightFromBracket,
	faShare,
	faTrashCan,
	faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import { CalendarEvent } from 'calendar-link';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { htmlToText } from 'html-to-text';
import React from 'react';

import { useCreateSessionAttendeeMutation } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { faCalendarCirclePlus } from '../../icons';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { formatDateRange } from '../../utils/formatDateRange';
import { sessionAttendeeReducer } from '../../utils/reducer';
import { AttendeeWithUser, PasswordlessUser } from '../../utils/stripUserPassword';
import { AddToCalendar } from '../AddToCalendar';
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { TooltipIcon } from '../TooltipIcon';
import { AttendeeList } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { LeaveSessionDialog } from '../radix/components/LeaveSessionDialog';
import { ShareSessionDropdown } from '../radix/components/ShareSessionDropdown';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	sid: string;
	isAttending: boolean;
	roleAttendees: AttendeeWithUser[] | undefined;
	attendees: AttendeeWithUser[] | undefined;
	session: SessionWithVenue;
	admin?: boolean;
	event: Prisma.Event;
	user: PasswordlessUser | undefined;
};

export const ViewSession: React.FC<Props> = (props) => {
	const {
		user,
		session,
		sid,
		eid,
		isAttending,
		admin = false,
		attendees,
		event,
		roleAttendees
	} = props;
	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		String(eid),
		String(sid),
		user?.id,
		{ redirectUrl: `/events/${eid}/sessions/${sid}` }
	);

	if (!session) return null;

	const SESSION_CALENDAR_EVENT: CalendarEvent = {
		title: session.name,
		description: htmlToText(session.description || 'No description'),
		location: session?.venue?.address || event.location || session?.venue?.name,
		end: new Date(session.endDate).toISOString(),
		start: new Date(session.startDate).toISOString(),
		url: `${
			process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
		}/events/${eid}/sessions/${sid}`,
		guests: attendees?.map((attendee) => attendee.user.name) ?? undefined
	};

	return (
		<div>
			{!isAttending &&
				session.maxAttendees !== null &&
				session.attendeeCount >= session.maxAttendees && (
					<div className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						This session is full
					</div>
				)}

			<FlexRowBetween variant="noWrapStart">
				<h1 className="mb-1.5 text-2xl font-bold leading-[1.2] tracking-tight md:text-3xl">
					{session.name}
				</h1>

				<div className="flex flex-row items-center">
					<ShareSessionDropdown event={event} session={session}>
						<div className="ml-4 flex items-center">
							<Tooltip side={'top'} message={'Share this session'}>
								<button type="button" className="h-5 w-5 text-gray-600">
									<FontAwesomeIcon
										fill="currentColor"
										className="h-5 w-5"
										size="1x"
										icon={faShare}
									/>
								</button>
							</Tooltip>
						</div>
					</ShareSessionDropdown>

					{user && isAttending && !admin && <AddToCalendar event={SESSION_CALENDAR_EVENT} />}

					{user && Boolean(isAttending) && (
						<LeaveSessionDialog
							eventSlug={event.slug}
							sessionSlug={session.slug}
							userSlug={String(user?.slug)}
						>
							<div className="flex items-center justify-center">
								<Tooltip side={'top'} message={'Leave this session'}>
									<button type="button" className="ml-4">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5 text-red-500 block"
											size="1x"
											icon={faRightFromBracket}
										/>
									</button>
								</Tooltip>
							</div>
						</LeaveSessionDialog>
					)}

					{user && !isAttending && !admin && (
						<IconButtonTooltip
							message="Click to add this session to your schedule"
							side="top"
							icon={faCalendarCirclePlus}
							disabled={createSessionAttendeeMutation.isLoading}
							isLoading={createSessionAttendeeMutation.isLoading}
							className="text-gray-600"
							onClick={() => {
								createSessionAttendeeMutation.mutate();
							}}
						/>
					)}
					{admin && (
						<IconLinkTooltip
							message="Click to edit this session"
							side="top"
							href={`/events/${eid}/admin/sessions/${sid}/edit`}
							icon={faPenToSquare}
							className="text-gray-700 hover:text-gray-600"
						/>
					)}
					{admin && (
						<IconLinkTooltip
							message="Click to delete this session"
							side="top"
							href={`/events/${eid}/admin/sessions/${sid}/delete`}
							icon={faTrashCan}
							className="text-red-500 hover:text-red-400"
						/>
					)}
				</div>
			</FlexRowBetween>

			<div className="mb-4">
				<div className="flex flex-row flex-wrap items-center text-gray-600">
					{session?.type?.name && (
						<TooltipIcon
							customIcon={
								<div
									className="mr-1.5 h-3 w-3 rounded-full"
									style={{ backgroundColor: session.type.color }}
								/>
							}
							link={`/events/${eid}/sessions/types/${session.type.slug}`}
							tooltipMessage={`This session is a part of the ${session.type.name} category.`}
							label={session.type.name}
						/>
					)}

					<TooltipIcon
						icon={faCalendarDay}
						tooltipMessage={`This is session is taking place on ${formatDateRange(
							new Date(session.startDate),
							new Date(session.endDate)
						)}.`}
						link={`/events/${eid}/sessions/dates/${dayjs(session.startDate).format('YYYY-MM-DD')}`}
						label={formatDateRange(new Date(session.startDate), new Date(session.endDate))}
					/>

					{session?.venue?.name && (
						<TooltipIcon
							icon={faLocationDot}
							link={`/events/${event.slug}/venues/${session.venue.slug}`}
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
			</div>

			{session.description && (
				<div className="prose mt-1 focus:outline-none prose-a:text-primary">
					{parse(String(session.description))}
				</div>
			)}

			{roleAttendees &&
				Object.entries(roleAttendees.reduce(sessionAttendeeReducer, {})).map(([key, attendees]) => (
					<div key={key}>
						<h3 className="my-3 mt-5 text-2xl font-medium">
							{key}s <span className="font-normal text-gray-500">({attendees?.length || 0})</span>
						</h3>

						{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} />}
					</div>
				))}

			<h3 className="my-3 mt-5 text-2xl font-medium">
				Attendees <span className="font-normal text-gray-500">({attendees?.length || 0})</span>
			</h3>

			{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} tiny />}
		</div>
	);
};
