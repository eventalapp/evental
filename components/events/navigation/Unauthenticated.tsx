import Link from 'next/link';
import React from 'react';
import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../../../utils/string';
import Prisma from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

export const Unauthenticated: React.FC<Props> = (props) => {
	const { setIsOpen, roles, event } = props;

	return (
		<div>
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<NavigationMenuPrimitive.Root className="w-full relative">
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
												className="text-xl max-w-2xl tracking-tight font-bold font-display"
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
						className={cx('absolute flex justify-center z-30', 'w-[30%] left-[45%] top-[100%]')}
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
		</div>
	);
};
