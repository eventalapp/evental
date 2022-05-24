import { faCalendarDay, faClipboardList, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import { CalendarEvent } from 'calendar-link';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import parse from 'html-react-parser';
import Link from 'next/link';
import React from 'react';

import { useCreateSessionAttendeeMutation } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { AddToCalendar } from '../AddToCalendar';
import { AttendeeList } from '../attendees/AttendeeList';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { LinkButton } from '../form/LinkButton';
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
};

export const ViewSession: React.FC<Props> = (props) => {
	const { session, sid, eid, isAttending, admin = false, attendees, event, roleAttendees } = props;
	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		String(eid),
		String(sid),
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
			<FlexRowBetween>
				<div className="flex items-center">
					{session?.type && (
						<div
							className="rounded-full mr-3 w-4 h-4"
							style={{ backgroundColor: session?.type?.color ?? '#888888' }}
						/>
					)}

					<h1 className="text-2xl md:text-3xl font-medium">{session.name}</h1>
				</div>
				<div className="space-x-4">
					{isAttending && !admin && <AddToCalendar event={SESSION_CALENDAR_EVENT} />}

					{!isAttending && !admin && (
						<Button
							type="button"
							className="ml-4"
							variant="primary"
							padding="medium"
							onClick={() => {
								createSessionAttendeeMutation.mutate();
							}}
							disabled={createSessionAttendeeMutation.isLoading}
						>
							{createSessionAttendeeMutation.isLoading ? <LoadingInner /> : 'Attend This Session'}
						</Button>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/edit`} passHref>
							<LinkButton className="ml-3">Edit session</LinkButton>
						</Link>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/delete`} passHref>
							<LinkButton className="ml-3">Delete session</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>

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

			<Tooltip
				side={'top'}
				message={`This is session is taking place from ${format(
					new Date(session.startDate),
					'MMMM do h:mm a'
				)} to ${formatInTimeZone(
					new Date(session.endDate),
					Intl.DateTimeFormat().resolvedOptions().timeZone,
					'MMMM do h:mm a zzz'
				)}.`}
			>
				<div className="inline-flex flex-row items-center mb-2 cursor-help">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faCalendarDay}
					/>
					<p>
						{formatInTimeZone(
							new Date(session.startDate),
							Intl.DateTimeFormat().resolvedOptions().timeZone,
							'MMMM dd h:mm a'
						)}{' '}
						-{' '}
						{formatInTimeZone(
							new Date(session.endDate),
							Intl.DateTimeFormat().resolvedOptions().timeZone,
							'MMMM dd h:mm a'
						)}
					</p>
				</div>
			</Tooltip>

			{session.description && (
				<div className="prose focus:outline-none prose-a:text-primary mt-1">
					{parse(String(session.description))}
				</div>
			)}

			{roleAttendees &&
				Object.entries(
					roleAttendees.reduce((acc: Record<string, AttendeeWithUser[]>, attendee) => {
						if (!acc[attendee.role.name]) {
							acc[attendee.role.name] = [];
						}
						acc[attendee.role.name].push(attendee);
						return acc;
					}, {})
				).map(([key, attendees]) => (
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
