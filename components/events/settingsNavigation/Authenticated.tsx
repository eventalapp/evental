import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { ProfileDropdown } from '../../navigation/dropdown';
import { FullscreenLinkItem } from '../navigation/Unauthenticated';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
	event: Prisma.Event;
} & UseSignOutMutationData;

const LinkItem: React.FC<{ link: string; label: string }> = (props) => {
	const { link, label } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<NavigationMenuPrimitive.Link
				className={cx(
					'cursor-pointer pb-1.5 border-b-2',
					router.asPath == link ? 'border-primary' : 'border-transparent'
				)}
			>
				<NavigationMenuPrimitive.Item
					className={cx(
						'px-3 py-1.5 text-sm rounded-md hover:bg-gray-75 dark:hover:bg-gray-900',
						'text-sm font-medium dark:text-gray-75 font-medium',
						router.asPath == link ? 'text-primary' : 'text-gray-900'
					)}
				>
					{label}
				</NavigationMenuPrimitive.Item>
			</NavigationMenuPrimitive.Link>
		</Link>
	);
};

export const SettingsAuthenticated: React.FC<Props> = (props) => {
	const { signOutMutation, setIsOpen, user, event, isOpen } = props;

	return (
		<div>
			<div className="w-full bg-primary">
				<Link href={`/events/${event.slug}`}>
					<a className="m-auto block text-center text-white text-sm py-1">
						You are in admin mode <span className="font-medium">(Click to exit)</span>
					</a>
				</Link>
			</div>
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<NavigationMenuPrimitive.Root className="w-full">
					<NavigationMenuPrimitive.List className="flex items-center justify-between w-full max-w-7xl m-auto h-14 px-3">
						<div>
							<Link href={`/`} passHref>
								<NavigationMenuPrimitive.Link>
									<NavigationMenuPrimitive.Item>
										<span className="flex flex-row items-center">
											<img
												src="https://cdn.evental.app/images/logo.svg"
												className="w-12 h-12 pr-3"
												alt="logo"
											/>
											<strong
												className="text-2xl tracking-tight font-bold font-display"
												aria-label="evental homepage"
											>
												Evental
											</strong>
										</span>
									</NavigationMenuPrimitive.Item>
								</NavigationMenuPrimitive.Link>
							</Link>
						</div>

						<div className="flex-row space-x-8 font-medium flex lg:hidden">
							<FontAwesomeIcon
								className="py-2 cursor-pointer"
								size="2x"
								icon={faBars}
								onClick={() => {
									setIsOpen(true);
								}}
							/>
						</div>

						<div className="h-full flex-row justify-end hidden lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/events/${event.slug}/admin/sessions`} label={'Sessions'} />
								<LinkItem link={`/events/${event.slug}/admin/sessions/types`} label={'Types'} />
								<LinkItem link={`/events/${event.slug}/admin/venues`} label={'Venues'} />
								<LinkItem link={`/events/${event.slug}/admin/attendees`} label={'Attendees'} />
								<LinkItem link={`/events/${event.slug}/admin/roles`} label={'Roles'} />
								<LinkItem link={`/events/${event.slug}/admin/organizers`} label={'Organizers'} />
								<LinkItem link={`/events/${event.slug}/admin/pages`} label={'Pages'} />
								<LinkItem link={`/events/${event.slug}/admin`} label={'Settings'} />
							</div>
						</div>

						<div className="justify-end items-center hidden lg:flex">
							<NavigationMenuPrimitive.Item className="flex">
								{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
							</NavigationMenuPrimitive.Item>
						</div>

						<NavigationMenuPrimitive.Indicator
							className={cx(
								'z-10',
								'top-[100%] flex items-end justify-center h-2 overflow-hidden',
								'radix-state-visible:animate-fade-in',
								'radix-state-hidden:animate-fade-out',
								'transition-[width_transform] duration-[250ms] ease-[ease]'
							)}
						>
							<div className="top-1 relative bg-gray-200 dark:bg-gray-800 w-2 h-2 rotate-45" />
						</NavigationMenuPrimitive.Indicator>
					</NavigationMenuPrimitive.List>

					<div
						className={cx('absolute flex justify-center z-30', 'w-[100%] left-[45%] top-[5.5%]')}
						style={{
							perspective: '2000px'
						}}
					>
						<NavigationMenuPrimitive.Viewport
							className={cx(
								'relative mt-2 shadow-lg rounded-md bg-gray-75 dark:bg-gray-800 overflow-hidden',
								'w-radix-navigation-menu-viewport',
								'h-radix-navigation-menu-viewport',
								'radix-state-open:animate-scale-in-content',
								'radix-state-closed:animate-scale-out-content',
								'origin-[top_center] transition-[width_height] duration-300 ease-[ease]'
							)}
						/>
					</div>
				</NavigationMenuPrimitive.Root>
			</div>
			<ul
				className={classNames(
					'fixed top-0 bottom-0 bg-white w-full z-50 transition-all duration-100',
					isOpen ? 'right-0' : '-right-full'
				)}
			>
				<div className="relative w-full h-full">
					<div className="w-full h-full flex flex-col items-center justify-center">
						<button
							onClick={() => {
								setIsOpen(false);
							}}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mb-3 cursor-pointer"
								size="2x"
								icon={faXmark}
							/>
						</button>
						<FullscreenLinkItem
							index={0}
							link={`/events/${event.slug}/admin/sessions`}
							label={'Sessions'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={0}
							link={`/events/${event.slug}/admin/sessions/types`}
							label={'Types'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={1}
							link={`/events/${event.slug}/admin/venues`}
							label={'Venues'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={2}
							link={`/events/${event.slug}/admin/attendees`}
							label={'Attendees'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={3}
							link={`/events/${event.slug}/admin/roles`}
							label={'Roles'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={4}
							link={`/events/${event.slug}/admin/organizers`}
							label={'Organizers'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={5}
							link={`/events/${event.slug}/admin/pages`}
							label={'Pages'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={6}
							link={`/events/${event.slug}/admin`}
							label={'Settings'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			</ul>
		</div>
	);
};
