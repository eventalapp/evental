import { faGoogle, faYahoo } from '@fortawesome/free-brands-svg-icons';
import { faCalendarPlus, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link';
import cx from 'classnames';
import React from 'react';
import { faOutlook } from '../../../icons/';
import Tooltip from './Tooltip';

interface Props {
	event: CalendarEvent;
	align?: 'start' | 'center' | 'end';
}

export const AddToCalendarDropdown = (props: Props) => {
	const { event, align = 'end' } = props;

	return (
		<div className="relative inline-block text-left">
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger>
					<div>
						<Tooltip message="Add this session to your calendar" side="top">
							<button className="flex items-center justify-center p-1.5">
								<FontAwesomeIcon
									fill="currentColor"
									className="h-5 w-5"
									size="1x"
									icon={faCalendarPlus}
								/>
							</button>
						</Tooltip>
					</div>
				</DropdownMenuPrimitive.Trigger>

				<DropdownMenuPrimitive.Content
					align={align}
					sideOffset={5}
					className={cx(
						' radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
						'w-48 rounded-lg px-1.5 py-1 shadow-sm md:w-56',
						'bg-white border border-gray-200 dark:bg-gray-800'
					)}
				>
					<a href={ics(event)} target="_blank" rel="noopener noreferrer" download="cal.ics">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-3.5 w-3.5 text-gray-600"
								size="1x"
								icon={faEnvelope}
							/>
							<span className="flex-grow text-gray-700 dark:text-gray-300">ICS</span>
						</DropdownMenuPrimitive.Item>
					</a>
					<a href={google(event)} target="_blank" rel="noopener noreferrer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-3.5 w-3.5 text-[#DB4437]"
								size="1x"
								icon={faGoogle}
							/>
							<span className="flex-grow text-gray-700 dark:text-gray-300">Google</span>
						</DropdownMenuPrimitive.Item>
					</a>

					<a href={outlook(event)} target="_blank" rel="noopener noreferrer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-3.5 w-3.5 text-[#0072c6]"
								size="1x"
								icon={faOutlook}
							/>
							<span className="flex-grow text-gray-700 dark:text-gray-300">Outlook</span>
						</DropdownMenuPrimitive.Item>
					</a>
					<a href={office365(event)} target="_blank" rel="noopener noreferrer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-3.5 w-3.5 text-[#0072c6]"
								size="1x"
								icon={faOutlook}
							/>
							<span className="flex-grow text-gray-700 dark:text-gray-300">Outlook 365</span>
						</DropdownMenuPrimitive.Item>
					</a>
					<a href={yahoo(event)} target="_blank" rel="noopener noreferrer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-3.5 w-3.5 text-[#4a00a0]"
								size="1x"
								icon={faYahoo}
							/>
							<span className="flex-grow text-gray-700 dark:text-gray-300">Yahoo</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};
