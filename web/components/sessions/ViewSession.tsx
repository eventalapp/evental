import Prisma from '@eventalapp/shared/db';
import {
	faCalendarDay,
	faLocationDot,
	faPenToSquare,
	faRightFromBracket,
	faShare,
	faTrashCan,
	faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { htmlToText } from 'html-to-text';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useCreateSessionAttendeeMutation } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { formatDateRange } from '../../utils/date';
import { faCalendarCirclePlus } from '../../utils/icons';
import { sessionAttendeeReducer } from '../../utils/reducer';
import { AttendeeWithUser, StrippedUser } from '../../utils/user';
import { AttendeeList, attendeeListSkeleton } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { AddToCalendar } from '../primitives/AddToCalendar';
import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip } from '../primitives/IconLinkTooltip';
import { TooltipIcon, TooltipIconSkeleton } from '../primitives/TooltipIcon';
import DeleteSessionDialog from './DeleteSessionDialog';
import { LeaveSessionDialog } from './LeaveSessionDialog';
import { ShareSessionDropdown } from './ShareSessionDropdown';

type Props = {
	eid: string;
	sid: string;
	isAttending?: boolean;
	roleAttendees?: AttendeeWithUser[] | undefined;
	attendees?: AttendeeWithUser[] | undefined;
	session?: SessionWithVenue;
	admin?: boolean;
	event?: Prisma.Event;
	user?: StrippedUser | undefined;
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

	return (
		<div>
			{!isAttending &&
				session &&
				session.maxAttendees !== null &&
				session.attendeeCount >= session.maxAttendees && (
					<div className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						This session is full
					</div>
				)}

			<FlexRowBetween variant="noWrapStart">
				<Heading>{session ? session.name : <Skeleton className="w-64 max-w-xl" />}</Heading>

				<div className="flex flex-row items-center space-x-4">
					{event && session ? (
						<ShareSessionDropdown event={event} session={session}>
							<IconButtonTooltip icon={faShare} message="Share this session" color="gray" />
						</ShareSessionDropdown>
					) : (
						<Skeleton className="h-5 w-5" />
					)}

					{session && event ? (
						!admin &&
						user &&
						isAttending && (
							<AddToCalendar
								event={{
									title: session.name,
									description: htmlToText(session.description || 'No description'),
									location: session?.venue?.address || event.location || session?.venue?.name,
									end: new Date(session.endDate).toISOString(),
									start: new Date(session.startDate).toISOString(),
									url: `${
										process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
									}/events/${eid}/sessions/${sid}`,
									guests: attendees?.map((attendee) => attendee.user.name) ?? undefined
								}}
							/>
						)
					) : (
						<Skeleton className="h-5 w-5" />
					)}

					{event && session ? (
						Boolean(isAttending) &&
						user &&
						!admin && (
							<LeaveSessionDialog
								eventSlug={event.slug}
								sessionSlug={session.slug}
								userSlug={String(user?.slug)}
							>
								<IconButtonTooltip
									icon={faRightFromBracket}
									message="Leave this session"
									color="red"
								/>
							</LeaveSessionDialog>
						)
					) : (
						<Skeleton className="h-5 w-5" />
					)}

					{user && !isAttending && !admin && (
						<IconButtonTooltip
							message="Add this session to your schedule"
							icon={faCalendarCirclePlus}
							disabled={createSessionAttendeeMutation.isLoading}
							isLoading={createSessionAttendeeMutation.isLoading}
							color="gray"
							onClick={() => {
								createSessionAttendeeMutation.mutate();
							}}
						/>
					)}

					{admin && (
						<IconLinkTooltip
							message="Edit this session"
							color="gray"
							href={`/events/${eid}/admin/sessions/${sid}/edit`}
							icon={faPenToSquare}
						/>
					)}

					{admin && (
						<DeleteSessionDialog eid={String(eid)} sid={String(sid)}>
							<IconButtonTooltip icon={faTrashCan} message="Delete this session" color="red" />
						</DeleteSessionDialog>
					)}
				</div>
			</FlexRowBetween>

			<div className="mb-2">
				<div className="flex flex-row flex-wrap items-center text-gray-600">
					{session?.category?.name && (
						<TooltipIcon
							customIcon={
								<div
									className="mr-1.5 h-3 w-3 rounded-full"
									style={{ backgroundColor: session.category.color }}
								/>
							}
							link={`/events/${eid}${admin ? '/admin' : ''}/sessions/categories/${
								session.category.slug
							}`}
							tooltipMessage={`This session is a part of the ${session.category.name} category.`}
							label={session.category.name}
						/>
					)}

					{session ? (
						<TooltipIcon
							icon={faCalendarDay}
							tooltipMessage={`This is session is taking place on ${formatDateRange(
								new Date(session.startDate),
								new Date(session.endDate)
							)}.`}
							link={`/events/${eid}/sessions/dates/${dayjs(session.startDate).format(
								'YYYY-MM-DD'
							)}`}
							label={formatDateRange(new Date(session.startDate), new Date(session.endDate))}
						/>
					) : (
						<TooltipIconSkeleton />
					)}

					{session ? (
						session.venue?.name && (
							<TooltipIcon
								icon={faLocationDot}
								link={`/events/${eid}${admin ? '/admin' : ''}/venues/${session.venue.slug}`}
								tooltipMessage={`This session is taking place at the ${session?.venue?.name} venue.`}
								label={session?.venue?.name}
							/>
						)
					) : (
						<TooltipIconSkeleton />
					)}

					{session ? (
						session?.maxAttendees !== null && (
							<TooltipIcon
								icon={faUserGroup}
								tooltipMessage={`This sessions is currently ${Math.ceil(
									(session?.attendeeCount / session?.maxAttendees) * 100
								)}% Full (${session?.attendeeCount}/${session?.maxAttendees} attendees).`}
								label={`${Math.ceil((session?.attendeeCount / session?.maxAttendees) * 100)}% Full`}
							/>
						)
					) : (
						<TooltipIconSkeleton />
					)}
				</div>
			</div>

			{session ? (
				session.description && (
					<div className="prose mt-1 focus:outline-none prose-a:text-primary">
						{parse(String(session.description))}
					</div>
				)
			) : (
				<Skeleton className="w-full" count={5} />
			)}

			{roleAttendees ? (
				Object.entries(roleAttendees.reduce(sessionAttendeeReducer, {})).map(([key, attendees]) => (
					<div key={key}>
						<h3 className="my-3 mt-5 text-2xl font-medium">
							{key}s <span className="font-normal text-gray-500">({attendees?.length || 0})</span>
						</h3>

						{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} />}
					</div>
				))
			) : (
				<>
					<h3 className="my-3 mt-5 text-2xl font-medium">
						<Skeleton className="w-48" />
					</h3>
					<ul className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">
						{attendeeListSkeleton}
					</ul>
				</>
			)}

			<h3 className="my-3 mt-5 text-2xl font-medium">
				{attendees ? (
					<>
						Attendees <span className="font-normal text-gray-500">({attendees?.length || 0})</span>
					</>
				) : (
					<Skeleton className="w-48" />
				)}
			</h3>

			<AttendeeList admin={admin} eid={eid} attendees={attendees} />
		</div>
	);
};
