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
					'border border-gray-200 bg-white shadow-sm dark:bg-gray-800',
					'relative min-w-[350px] focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
				)}
			>
				<HoverCardPrimitive.Arrow
					className="fill-current text-gray-200 dark:text-gray-800"
					offset={10}
				/>

				<div className="h-full w-full">
					{user && (
						<div className="absolute right-3 bottom-3 flex w-full flex-row justify-end">
							<Tooltip side={'top'} message={`Add the ${session.name} session to your schedule`}>
								<button
									onClick={() => {
										createSessionAttendeeMutation.mutate();
									}}
								>
									<FontAwesomeIcon
										fill="currentColor"
										className="h-7 w-7 cursor-pointer text-gray-600"
										size="lg"
										icon={faCalendarCirclePlus}
									/>
								</button>
							</Tooltip>
						</div>
					)}

					<h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
						{session.name}
					</h3>

					<div className="flex flex-row flex-wrap items-center text-gray-600">
						{session.type && (
							<div className="mr-3">
								<Tooltip
									side={'top'}
									message={`This session is in the ${session.type.name} category`}
								>
									<div className="inline-flex cursor-help flex-row items-center">
										<div className="mr-1.5 flex h-5 w-5 items-center justify-center">
											<div
												className="h-3 w-3 rounded-full"
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
									<div className="inline-flex cursor-help flex-row items-center">
										<FontAwesomeIcon
											fill="currentColor"
											className="mr-1.5 h-5 w-5"
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
									<div className="inline-flex cursor-help flex-row items-center">
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

					{session.description && (
						<p className="mt-1 text-sm font-normal text-gray-700 dark:text-gray-400">
							{descriptionAsText.substring(0, 150)}
							{descriptionAsText.length > 150 && '...'}
						</p>
					)}

					{session.roleMembers && session.roleMembers.length > 0 && (
						<ul className="mt-4 grid grid-cols-4 gap-2">
							{session.roleMembers.slice(0, 4).map((roleMember) => (
								<li
									key={roleMember.attendee.id}
									className="relative flex h-full flex-col items-center justify-between"
								>
									<Link
										href={`/events/${event.slug}${admin ? '/admin' : ''}/attendees/${
											roleMember.attendee.user.slug
										}`}
									>
										<a className="flex h-full flex-col items-center justify-start">
											<div className="relative mb-1 h-10 w-10 rounded-full border-2 border-gray-100">
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
											<span className="text-center text-sm">{roleMember.attendee.user.name}</span>
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
