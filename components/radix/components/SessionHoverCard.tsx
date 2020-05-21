import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import cx from 'classnames';
import React from 'react';
import { SessionWithVenue } from '../../../pages/api/events/[eid]/sessions';
import { htmlToText } from 'html-to-text';
import Tooltip from './Tooltip';
import Button from './shared/Button';
import { useCreateSessionAttendeeMutation } from '../../../hooks/mutations/useCreateSessionAttendeeMutation';
import Prisma from '@prisma/client';

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
		<HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
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
						<h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.name}</h3>

						{session.venue && (
							<Tooltip
								side={'top'}
								message={`This session is taking place at the ${session.venue.name} venue`}
							>
								<div className="cursor-help">{session.venue.name}</div>
							</Tooltip>
						)}

						{session.type && (
							<Tooltip
								side={'top'}
								message={`This session is in the ${session.type.name} category`}
							>
								<div className="flex flex-row items-center cursor-help">
									<div
										className="rounded-full mr-2 w-4 h-4"
										style={{
											backgroundColor: session?.type?.color ?? '#888888'
										}}
									/>
									{session.type.name}
								</div>
							</Tooltip>
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
