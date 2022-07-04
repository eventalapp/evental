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
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { htmlToText } from 'html-to-text';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { useCreateSessionAttendeeMutation } from '../../hooks/mutations/useCreateSessionAttendeeMutation';
import { faCalendarCirclePlus } from '../../icons';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { formatDateRange } from '../../utils/formatDateRange';
import { sessionAttendeeReducer } from '../../utils/reducer';
import { AttendeeWithUser, StrippedUser } from '../../utils/stripUser';
import { AddToCalendar } from '../AddToCalendar';
import { IconButtonTooltip } from '../IconButtonTooltip';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { TooltipIcon, TooltipIconSkeleton } from '../TooltipIcon';
import { AttendeeList } from '../attendees/AttendeeList';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import DeleteSessionDialog from '../radix/components/DeleteSessionDialog';
import { LeaveSessionDialog } from '../radix/components/LeaveSessionDialog';
import { ShareSessionDropdown } from '../radix/components/ShareSessionDropdown';
import Tooltip from '../radix/components/Tooltip';
import { Heading } from '../typography/Heading';

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
				<Heading>{session ? session.name : <Skeleton className="w-full max-w-xl" />}</Heading>

				<div className="flex flex-row items-center">
					{event && session ? (
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
					) : (
						<Skeleton className="w-5 h-5 ml-4" />
					)}

					{user && session && event ? (
						!admin &&
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
						<Skeleton className="w-5 h-5 ml-4" />
					)}

					{user && event && session ? (
						Boolean(isAttending) && (
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
						)
					) : (
						<Skeleton className="w-5 h-5 ml-4" />
					)}

					{user ? (
						!isAttending &&
						!admin && (
							<div className="ml-4">
								<IconButtonTooltip
									message="Add this session to your schedule"
									side="top"
									icon={faCalendarCirclePlus}
									disabled={createSessionAttendeeMutation.isLoading}
									isLoading={createSessionAttendeeMutation.isLoading}
									className="text-gray-600"
									onClick={() => {
										createSessionAttendeeMutation.mutate();
									}}
								/>
							</div>
						)
					) : (
						<Skeleton className="w-5 h-5 ml-4" />
					)}

					{admin && (
						<div className="ml-4">
							<IconLinkTooltip
								message="Edit this session"
								side="top"
								href={`/events/${eid}/admin/sessions/${sid}/edit`}
								icon={faPenToSquare}
								className="text-gray-700 hover:text-gray-600"
							/>
						</div>
					)}

					{admin && (
						<DeleteSessionDialog eid={String(eid)} sid={String(sid)}>
							<div className="flex items-center justify-center">
								<Tooltip side={'top'} message={'Delete this session'}>
									<button type="button" className="ml-4">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5 text-red-500 block"
											size="1x"
											icon={faTrashCan}
										/>
									</button>
								</Tooltip>
							</div>
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
							link={`/events/${eid}/sessions/categories/${session.category.slug}`}
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
								link={`/events/${eid}/venues/${session.venue.slug}`}
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

			<AttendeeList admin={admin} eid={eid} attendees={attendees} />
		</div>
	);
};
