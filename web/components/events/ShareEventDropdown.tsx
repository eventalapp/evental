import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Prisma from '@prisma/client';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import React from 'react';

import { emailLink, facebookLink, linkedinLink, twitterLink } from '@eventalapp/shared/utils';

interface Props {
	event: Prisma.Event;
	align?: 'start' | 'center' | 'end';
}

export const ShareEventDropdown: React.FC<Props> = (props) => {
	const { event, align = 'end', children } = props;

	return (
		<div className="relative inline-block text-left">
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger asChild>{children}</DropdownMenuPrimitive.Trigger>

				<DropdownMenuPrimitive.Content
					align={align}
					sideOffset={5}
					className={cx(
						' radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
						'w-48 rounded-lg px-1.5 py-1 shadow-sm md:w-56',
						'border border-gray-200 bg-white dark:bg-gray-800'
					)}
				>
					<a
						href={twitterLink(
							`https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'}/events/${event.slug}`,
							{
								title: `Checkout ${event.name} on Evental!`,
								hashtags: ['evental', 'eventalapp'],
								via: 'eventaldotapp',
								related: ['eventalapp', 'eventalapp.com']
							}
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-4 w-4 text-[#1DA1F2]"
								size="1x"
								icon={faTwitter}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Twitter</span>
						</DropdownMenuPrimitive.Item>
					</a>
					<a
						href={facebookLink(
							`${process.env.VERCEL_URL || 'http://localhost:3000'}/events/${event.slug}`,
							{
								quote: `Checkout ${event.name} on Evental!`,
								hashtag: 'evental'
							}
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-4 w-4 text-[#4267B2]"
								size="1x"
								icon={faFacebook}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Facebook</span>
						</DropdownMenuPrimitive.Item>
					</a>

					<a
						href={linkedinLink(
							`https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'}/events/${event.slug}`,
							{
								source: 'Evental',
								title: `Checkout ${event.name} on Evental!`,
								summary: `Checkout ${event.name} on Evental!`
							}
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						<DropdownMenuPrimitive.Item
							className={cx(
								'flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs outline-none',
								'text-gray-400 focus:bg-gray-50 dark:text-gray-500 dark:focus:bg-gray-900'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mr-2 h-4 w-4 text-[#0077B5]"
								size="1x"
								icon={faLinkedin}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">LinkedIn</span>
						</DropdownMenuPrimitive.Item>
					</a>
					<a
						href={emailLink(
							`https://${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'evental.app'}/events/${event.slug}`,
							{
								body: `Join me at ${event.name} on Evental!`,
								separator: '\n',
								subject: `Checkout ${event.name} on Evental!`
							}
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
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
								icon={faPaperPlane}
							/>
							<span className="grow text-gray-700 dark:text-gray-300">Email</span>
						</DropdownMenuPrimitive.Item>
					</a>
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Root>
		</div>
	);
};
