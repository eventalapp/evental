import {
	faCalendarDay,
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
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { AttendeeList } from '../attendees/AttendeeList';
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
					<div className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						This session is full
					</div>
				)}

			<FlexRowBetween>
				<div className="flex items-center">
					<h1 className="text-xl font-medium md:text-2xl">{session.name}</h1>
				</div>

				<div className="space-x-4">
					{isAttending && !admin && <AddToCalendar event={SESSION_CALENDAR_EVENT} />}

					{user && !isAttending && !admin && (
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
							className="text-red-500 hover:text-red-400"
						/>
					)}
				</div>
			</FlexRowBetween>

			<div className="mb-4">
				<div className="flex flex-row flex-wrap items-center text-gray-600">
					{session?.type?.name && (
						<div className="mr-3 block">
							<Link
								href={`/events/${eid}${admin ? '/admin' : ''}/sessions/types/${session.type.slug}`}
							>
								<a>
									<Tooltip
										side={'top'}
										message={`This session is a part of the ${session.type.name} category.`}
									>
										<div className="mb-1 inline-flex flex-row items-center">
											<div
												className="mr-1.5 h-4 w-4 rounded-full"
												style={{ backgroundColor: session.type.color ?? '#888888' }}
											/>
											<p>{session.type.name}</p>
										</div>
									</Tooltip>
								</a>
							</Link>
						</div>
					)}

					<div className="mr-3 block">
						<Tooltip
							side={'top'}
							message={`This is session is taking place on ${formatDateRange(
								new Date(session.startDate),
								new Date(session.endDate)
							)}.`}
						>
							<div className="inline-flex cursor-help flex-row items-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-1.5 h-5 w-5"
									size="1x"
									icon={faCalendarDay}
								/>
								<p>{formatDateRange(new Date(session.startDate), new Date(session.endDate))}</p>
							</div>
						</Tooltip>
					</div>

					{session?.venue?.name && (
						<div className="mr-3 block">
							<Link href={`/events/${eid}/venues/${session?.venue?.slug}`}>
								<a>
									<Tooltip
										side={'top'}
										message={`This session is taking place at the ${session?.venue?.name} venue.`}
									>
										<div className="mb-1 inline-flex flex-row items-center">
											<FontAwesomeIcon
												fill="currentColor"
												className="mr-1.5 h-5 w-5"
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
						<div className="mr-3 block">
							<Tooltip
								side={'top'}
								message={`This sessions is currently ${Math.ceil(
									(session?.attendeeCount / session?.maxAttendees) * 100
								)}% Full (${session?.attendeeCount}/${session?.maxAttendees} attendees).`}
							>
								<div className="mb-1 inline-flex cursor-help flex-row items-center">
									<FontAwesomeIcon
										fill="currentColor"
										className="mr-1.5 h-5 w-5"
										size="1x"
										icon={faUserGroup}
									/>
									<p>{Math.ceil((session?.attendeeCount / session?.maxAttendees) * 100)}% Full</p>
								</div>
							</Tooltip>
						</div>
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
