import {
	faAddressCard,
	faCalendar,
	faCalendarDays,
	faCog,
	faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Arrow } from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useSignOut } from '@eventalapp/shared/hooks';
import { StrippedUser } from '@eventalapp/shared/utils';

type Props = {
	user: StrippedUser | undefined;
};

export const ProfileDropdown = (props: Props) => {
	const { user } = props;
	const { mutate: signOut } = useSignOut();

	return (
		<DropdownMenuPrimitive.Root>
			<DropdownMenuPrimitive.Trigger>
				<div className="relative h-10 w-10 rounded-md border border-gray-200 shadow-sm">
					<Image
						className="rounded-md"
						layout="fill"
						src={
							user?.image
								? `https://cdn.evental.app${user?.image}`
								: `https://cdn.evental.app/images/default-avatar.jpg`
						}
						alt={user?.name || ''}
					/>
				</div>
			</DropdownMenuPrimitive.Trigger>

			<DropdownMenuPrimitive.Content
				align="end"
				sideOffset={3}
				className={cx(
					'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
					'w-48 rounded-lg px-1.5 py-1 md:w-56',
					'bg-white dark:bg-gray-800',
					'border border-gray-300 shadow'
				)}
			>
				<Link href={`/users/${user?.slug}`}>
					<a className="cursor-pointer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2.5 h-3.5 w-3.5"
								size="1x"
								icon={faAddressCard}
							/>
							<span className="grow font-medium text-gray-700 dark:text-gray-300">Profile</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</Link>
				<Link href={`/users/${user?.slug}/schedule`}>
					<a className="cursor-pointer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2.5 h-3.5 w-3.5"
								size="1x"
								icon={faCalendarDays}
							/>
							<span className="grow font-medium text-gray-700 dark:text-gray-300">Schedule</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</Link>

				<Link href="/events/attending">
					<a className="cursor-pointer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2.5 h-3.5 w-3.5"
								size="1x"
								icon={faCalendar}
							/>
							<span className="grow font-medium text-gray-700 dark:text-gray-300">Events</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</Link>

				<Link href="/settings">
					<a className="cursor-pointer">
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2.5 h-3.5 w-3.5"
								size="1x"
								icon={faCog}
							/>
							<span className="grow font-medium text-gray-700 dark:text-gray-300">Settings</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</Link>

				<DropdownMenuPrimitive.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

				<button
					onClick={() => {
						signOut();
					}}
					className="w-full"
				>
					<DropdownMenuPrimitive.Item
						className={cx(
							'flex select-none items-center rounded-md px-2 py-2 text-xs outline-none',
							'w-full text-left text-red-500 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
						)}
					>
						<FontAwesomeIcon
							fill="currentColor"
							className="mr-2.5 h-3.5 w-3.5"
							size="1x"
							icon={faRightFromBracket}
						/>
						<span className="grow font-medium text-red-700 dark:text-gray-300">Sign out</span>
					</DropdownMenuPrimitive.Item>
				</button>

				<Arrow className="text-gray-200" fill="currentColor" offset={15} />
			</DropdownMenuPrimitive.Content>
		</DropdownMenuPrimitive.Root>
	);
};
