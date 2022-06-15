import {
	faCalendarDay,
	faClipboardList,
	faLocationDot,
	faPenToSquare,
	faTrashCan,
	faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import { CalendarEvent } from 'calendar-link';
import parse from 'html-react-parser';
import Link from 'next/link';
import React from 'react';
import { useCreateSessionAttendeeMutation } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { faCalendarCirclePlus } from '../../icons';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { formatDateRange } from '../../utils/formatDateRange';
import { sessionAttendeeReducer } from '../../utils/reducer';
import { AttendeeWithUser, PasswordlessUser } from '../../utils/stripUserPassword';
import { AddToCalendar } from '../AddToCalendar';
import { AttendeeList } from '../attendees/AttendeeList';
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
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
		description: session.description ?? undefined,
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
					<div className="bg-red-500 block text-white px-5 py-3 rounded-md mb-4 font-medium">
						This session is full
					</div>
				)}

			<FlexRowBetween>
				<div className="flex items-center">
					{session?.type && (
						<div
							className="rounded-full mr-3 w-4 h-4"
							style={{ backgroundColor: session?.type?.color ?? '#888888' }}
						/>
					)}

					<h1 className="text-xl md:text-2xl font-medium">{session.name}</h1>
				</div>

				<div className="space-x-4">
					{isAttending && !admin && <AddToCalendar event={SESSION_CALENDAR_EVENT} />}

					{!isAttending && !admin && (
						<IconButtonTooltip
							message="Click to add this session to your schedule"
							side="top"
							icon={faCalendarCirclePlus}
							disabled={createSessionAttendeeMutation.isLoading}
							isLoading={createSessionAttendeeMutation.isLoading}
							className="text-gray-700"
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
							className="text-gray-700"
						/>
					)}
					{admin && (
						<IconLinkTooltip
							message="Click to delete this session"
							side="top"
							href={`/events/${eid}/admin/sessions/${sid}/delete`}
							icon={faTrashCan}
							className="text-red-500"
						/>
					)}
				</div>
			</FlexRowBetween>

			<div className="text-gray-600">
				<Tooltip
					side={'top'}
					message={`This is session is taking place on ${formatDateRange(
						new Date(session.startDate),
						new Date(session.endDate)
					)}.`}
				>
					<div className="inline-flex flex-row items-center mb-2 cursor-help">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mr-1.5"
							size="1x"
							icon={faCalendarDay}
						/>
						<p>{formatDateRange(new Date(session.startDate), new Date(session.endDate))}</p>
					</div>
				</Tooltip>

				{session?.type?.name && (
					<div className="block">
						<Link
							href={`/events/${eid}${admin ? '/admin' : ''}/sessions/types/${session?.type?.slug}`}
						>
							<a>
								<Tooltip side={'top'} message={`This session is a ${session?.type?.name} session.`}>
									<div className="inline-flex flex-row items-center mb-1">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faClipboardList}
										/>
										<p>{session?.type?.name}</p>
									</div>
								</Tooltip>
							</a>
						</Link>
					</div>
				)}
				{session?.venue?.name && (
					<div className="block">
						<Link href={`/events/${eid}/venues/${session?.venue?.slug}`}>
							<a>
								<Tooltip
									side={'top'}
									message={`This session is taking place at the ${session?.venue?.name} venue.`}
								>
									<div className="inline-flex flex-row items-center mb-1">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faLocationDot}
										/>
										<p>{session?.venue?.name}</p>
									</div>
								</Tooltip>
							</a>
						</Link>
					</div>
				)}
				{session?.maxAttendees !== null && (
					<div className="block">
						<Tooltip
							side={'top'}
							message={`This sessions is currently ${Math.ceil(
								(session?.attendeeCount / session?.maxAttendees) * 100
							)}% Full (${session?.attendeeCount}/${session?.maxAttendees} attendees).`}
						>
							<div className="inline-flex flex-row items-center mb-1 cursor-help">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faUserGroup}
								/>
								<p>{Math.ceil((session?.attendeeCount / session?.maxAttendees) * 100)}% Full</p>
							</div>
						</Tooltip>
					</div>
				)}
			</div>

			{session.description && (
				<div className="prose focus:outline-none prose-a:text-primary mt-1">
					{parse(String(session.description))}
				</div>
			)}

			{roleAttendees &&
				Object.entries(roleAttendees.reduce(sessionAttendeeReducer, {})).map(([key, attendees]) => (
					<div key={key}>
						<h3 className="text-2xl font-medium my-3">
							{key}s <span className="text-gray-500 font-normal">({attendees?.length || 0})</span>
						</h3>

						{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} />}
					</div>
				))}

			<h3 className="text-2xl font-medium my-3">
				Attendees <span className="text-gray-500 font-normal">({attendees?.length || 0})</span>
			</h3>

			{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} />}
		</div>
	);
};
