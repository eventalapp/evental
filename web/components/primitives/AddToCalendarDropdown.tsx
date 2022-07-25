import { faGoogle, faYahoo } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link';
import cx from 'classnames';

import { faCalendarCirclePlus, faOutlook } from '@eventalapp/shared/utils/icons';

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
				<DropdownMenuPrimitive.Trigger asChild>
					<div>
						<Tooltip message="Add this session to your calendar" side="top">
							<button className="flex items-center justify-center text-gray-600">
								<FontAwesomeIcon
									fill="currentColor"
									className="h-6 w-6"
									size="1x"
									icon={faCalendarCirclePlus}
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
						'border border-gray-200 bg-white dark:bg-gray-800'
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
								className="mr-2 h-4 w-4 text-gray-600"
								size="1x"
								icon={faEnvelope}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">ICS</span>
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
								className="mr-2 h-4 w-4 text-[#DB4437]"
								size="1x"
								icon={faGoogle}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Google</span>
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
								className="mr-2 h-4 w-4 text-[#0072c6]"
								size="1x"
								icon={faOutlook}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Outlook</span>
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
								className="mr-2 h-4 w-4 text-[#0072c6]"
								size="1x"
								icon={faOutlook}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Outlook 365</span>
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
								className="mr-2 h-4 w-4 text-[#4a00a0]"
								size="1x"
								icon={faYahoo}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Yahoo</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};
