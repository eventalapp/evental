import { faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import cx from 'classnames';
import { htmlToText } from 'html-to-text';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useCreateSessionAttendeeMutation } from '../../../hooks/mutations/useCreateSessionAttendeeMutation';
import { faCalendarCirclePlus } from '../../../icons';
import { SessionWithVenue } from '../../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import Tooltip from './Tooltip';

interface Props {
	event: Prisma.Event;
	session: SessionWithVenue;
	admin?: boolean;
	user: PasswordlessUser | undefined;
}

export const SessionHoverCard: React.FC<Props> = (props) => {
	const { children, session, event, admin, user } = props;

	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		event.slug,
		session.slug,
		user?.id
	);

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
					'max-w-lg rounded-lg p-4 md:w-full',
					'bg-white dark:bg-gray-800 border-gray-200 border shadow-sm',
					'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 min-w-[350px] relative'
				)}
			>
				<HoverCardPrimitive.Arrow
					className="fill-current text-gray-200 dark:text-gray-800"
					offset={10}
				/>

				<div className="h-full w-full">
					<div className="flex flex-row justify-end w-full absolute bottom-3 right-3">
						<Tooltip side={'top'} message={`Add the ${session.name} session to your schedule`}>
							<button
								onClick={() => {
									createSessionAttendeeMutation.mutate();
								}}
							>
								<FontAwesomeIcon
									fill="currentColor"
									className="w-7 h-7 cursor-pointer text-gray-600"
									size="lg"
									icon={faCalendarCirclePlus}
								/>
							</button>
						</Tooltip>
					</div>

					<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
						{session.name}
					</h3>

					<div className="text-gray-600 flex flex-row flex-wrap items-center">
						{session.type && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={`This session is in the ${session.type.name} category`}
								>
									<div className="inline-flex flex-row items-center cursor-help">
										<div className="w-5 h-5 flex items-center justify-center mr-1.5">
											<div
												className="rounded-full w-3 h-3"
												style={{
													backgroundColor: session?.type?.color ?? '#888888'
												}}
											/>
										</div>
										{session.type.name}
									</div>
								</Tooltip>
							</div>
						)}

						{session.venue && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={`This session is taking place at the ${session.venue.name} venue`}
								>
									<div className="inline-flex flex-row items-center cursor-help">
										<FontAwesomeIcon
											fill="currentColor"
											className="w-5 h-5 mr-1.5"
											size="1x"
											icon={faLocationDot}
										/>
										{session.venue.name}
									</div>
								</Tooltip>
							</div>
						)}

						{session?.maxAttendees !== null && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={`This sessions is currently ${Math.ceil(
										(session?.attendeeCount / session?.maxAttendees) * 100
									)}% Full (${session?.attendeeCount}/${session?.maxAttendees} attendees).`}
								>
									<div className="inline-flex flex-row items-center cursor-help">
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
						<p className="mt-1 text-sm font-normal text-gray-700 dark:text-gray-400">
							{descriptionAsText.substring(0, 150)}
							{descriptionAsText.length > 150 && '...'}
						</p>
					)}

					{session.roleMembers && session.roleMembers.length > 0 && (
						<ul className="grid grid-cols-4 gap-2 mt-4">
							{session.roleMembers.slice(0, 4).map((roleMember) => (
								<li
									key={roleMember.attendee.id}
									className="flex items-center justify-between flex-col h-full relative"
								>
									<Link
										href={`/events/${event.slug}${admin ? '/admin' : ''}/attendees/${
											roleMember.attendee.user.slug
										}`}
									>
										<a className="flex items-center justify-start flex-col h-full">
											<div className="h-10 w-10 relative mb-1 border-2 border-gray-100 rounded-full">
												<Image
													alt={String(roleMember.attendee.user.name)}
													src={String(
														roleMember.attendee?.user.image
															? `https://cdn.evental.app${roleMember.attendee?.user.image}`
															: `https://cdn.evental.app/images/default-avatar.jpg`
													)}
													className="rounded-full"
													layout="fill"
												/>
											</div>
											<span className="text-sm text-center">{roleMember.attendee.user.name}</span>
										</a>
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</HoverCardPrimitive.Content>
		</HoverCardPrimitive.Root>
	);
};
