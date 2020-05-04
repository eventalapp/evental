import Link from 'next/link';
import React from 'react';
import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { ProfileDropdown } from '../../navigation/dropdown';
import { capitalizeFirstLetter } from '../../../utils/string';
import Prisma from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
	event: Prisma.Event;
	roles: Prisma.EventRole[];
} & UseSignOutMutationData;

const LinkItem: React.FC<{ link: string; label: string }> = (props) => {
	const { link, label } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<NavigationMenuPrimitive.Link
				className={cx(
					'cursor-pointer pb-1.5',
					router.asPath == link && 'border-b-2 border-primary'
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

const FullscreenLinkItem: React.FC<{ link: string; label: string; onClick: () => void }> = (
	props
) => {
	const { link, label, onClick } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<a
				className={cx('cursor-pointer', router.asPath == link && 'border-b-2 border-primary')}
				onClick={onClick}
			>
				<li
					className={cx(
						'px-3 my-2 text-sm rounded-md hover:bg-gray-75 dark:hover:bg-gray-900',
						'text-sm font-medium dark:text-gray-75 font-medium',
						router.asPath == link ? 'text-primary' : 'text-gray-900'
					)}
				>
					{label}
				</li>
			</a>
		</Link>
	);
};

export const Authenticated: React.FC<Props> = (props) => {
	const { signOutMutation, setIsOpen, isOpen, user, roles, event } = props;

	return (
		<div>
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<NavigationMenuPrimitive.Root className="w-full relative">
					<NavigationMenuPrimitive.List className="flex items-center justify-between w-full max-w-7xl m-auto h-14 px-3">
						<div>
							<Link href={`/events/${event.slug}`} passHref>
								<NavigationMenuPrimitive.Link>
									<NavigationMenuPrimitive.Item>
										<span className="flex flex-row items-center cursor-pointer">
											<img
												src={`https://cdn.evental.app${event.image}`}
												className="w-11 h-11 mr-3 rounded-md"
												alt="logo"
											/>
											<strong
												className="text-2xl tracking-tight leading-none font-bold font-display"
												aria-label="evental homepage"
											>
												{event.name}
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
								<LinkItem link={`/events/${event.slug}`} label={'Sessions'} />
								<LinkItem link={`/events/${event.slug}/venues`} label={'Venues'} />

								{roles.map((role) => (
									<LinkItem
										key={role.id}
										link={`/events/${event.slug}/roles/${role.slug}`}
										label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
									/>
								))}

								<NavigationMenuPrimitive.Item className="pb-1.5">
									<NavigationMenuPrimitive.Trigger
										className={cx(
											'px-3 py-1.5 text-sm rounded-md hover:bg-gray-75 dark:hover:bg-gray-900',
											'text-sm font-medium text-gray-900 dark:text-gray-75 font-medium',
											'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
										)}
									>
										Resources
									</NavigationMenuPrimitive.Trigger>

									<NavigationMenuPrimitive.Content
										className={cx(
											'absolute w-auto top-0 left-0 rounded-lg bg-white border border-gray-200',
											'radix-motion-from-start:animate-enter-from-left',
											'radix-motion-from-end:animate-enter-from-right',
											'radix-motion-to-start:animate-exit-to-left',
											'radix-motion-to-end:animate-exit-to-right'
										)}
									>
										<div className="w-[16rem] lg:w-[18rem] p-3">
											<div className="w-full flex flex-col space-y-2">
												<NavigationMenuPrimitive.Link
													className={cx(
														'w-full px-4 py-3 hover:bg-gray-75 dark:hover:bg-gray-900 rounded-md',
														'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
													)}
													href="mailto:support@evental.app"
												>
													<span className="text-sm font-medium text-gray-900 dark:text-gray-75">
														Support
													</span>

													<div className="mt-1 text-sm text-gray-900 dark:text-gray-400">
														Email us at support@evental.app with any questions or concerns.
													</div>
												</NavigationMenuPrimitive.Link>
											</div>
										</div>
									</NavigationMenuPrimitive.Content>
								</NavigationMenuPrimitive.Item>
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
						className={cx('absolute flex justify-center z-30', 'w-[30%] left-[50%] top-[100%]')}
						style={{
							perspective: '1000px'
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
					<div className="absolute top-4 right-4">
						{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
					</div>
					<div className="w-full h-full flex flex-col items-center justify-center">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mb-3 cursor-pointer"
							size="2x"
							icon={faXmark}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							link={`/events/${event.slug}`}
							label={'Sessions'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							link={`/events/${event.slug}/venues`}
							label={'Venues'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>

						{roles.map((role) => (
							<FullscreenLinkItem
								key={role.id}
								link={`/events/${event.slug}/roles/${role.slug}`}
								label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						))}
					</div>
				</div>
			</ul>
		</div>
	);
};
