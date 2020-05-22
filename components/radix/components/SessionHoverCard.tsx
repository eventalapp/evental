import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import cx from 'classnames';
import React from 'react';
import { SessionWithVenue } from '../../../pages/api/events/[eid]/sessions';
import { htmlToText } from 'html-to-text';
import Tooltip from './Tooltip';
import Button from './shared/Button';
import { useCreateSessionAttendeeMutation } from '../../../hooks/mutations/useCreateSessionAttendeeMutation';
import Prisma from '@prisma/client';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
	event: Prisma.Event;
	session: SessionWithVenue;
}

export const SessionHoverCard: React.FC<Props> = (props) => {
	const { children, session, event } = props;

	const { createSessionAttendeeMutation } = useCreateSessionAttendeeMutation(
		event.slug,
		session.slug
	);

	return (
		<HoverCardPrimitive.Root openDelay={150} closeDelay={150}>
			<HoverCardPrimitive.Trigger asChild>{children}</HoverCardPrimitive.Trigger>
			<HoverCardPrimitive.Content
				align="center"
				sideOffset={4}
				className={cx(
					'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
					'max-w-md rounded-lg p-4 md:w-full',
					'bg-white dark:bg-gray-800 border-gray-200 border shadow-sm',
					'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 min-w-[250px]'
				)}
			>
				<HoverCardPrimitive.Arrow className="fill-current text-gray-200 dark:text-gray-800" />

				<div className="flex h-full w-full space-x-4">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{session.name}</h3>

						{session.venue && (
							<div>
								<Tooltip
									side={'top'}
									message={`This session is taking place at the ${session.venue.name} venue`}
								>
									<div className="inline-flex text-gray-800 flex-row items-center cursor-help">
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

						{session.type && (
							<div>
								<Tooltip
									side={'top'}
									message={`This session is in the ${session.type.name} category`}
								>
									<div className="inline-flex text-gray-800 flex-row items-center cursor-help">
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

						{session.description && (
							<p className="mt-1 text-sm font-normal text-gray-700 dark:text-gray-400">
								{htmlToText(session.description)}
							</p>
						)}

						<Tooltip side={'top'} message={`Add the ${session.name} session to your schedule`}>
							<Button
								className="mt-2"
								onClick={() => {
									createSessionAttendeeMutation.mutate();
								}}
							>
								Register
							</Button>
						</Tooltip>
					</div>
				</div>
			</HoverCardPrimitive.Content>
		</HoverCardPrimitive.Root>
	);
};
