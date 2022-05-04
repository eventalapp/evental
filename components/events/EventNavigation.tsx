import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prisma from '@prisma/client';
import { capitalizeFirstLetter } from '../../utils/string';

type Props = { eid: string; roles: Prisma.EventRole[] };

const LinkItem: React.FC<{ link: string; label: string }> = (props) => {
	const { link, label } = props;
	const router = useRouter();

	return (
		<Link href={link}>
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

const EventNavigationMenu = (props: Props) => {
	const { eid, roles } = props;

	return (
		<div>
			<div className="relative flex w-full border-b border-gray-200 mb-3">
				<NavigationMenuPrimitive.Root className="relative">
					<NavigationMenuPrimitive.List className="flex flex-row rounded-lg bg-white dark:bg-gray-800 px-2 pt-2 space-x-2 flex-wrap">
						<LinkItem link={`/events/${eid}`} label={'Sessions'} />
						<LinkItem link={`/events/${eid}/venues`} label={'Venues'} />
						{roles.map((role) => (
							<LinkItem
								key={role.id}
								link={`/events/${eid}/roles/${role.slug}`}
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
						className={cx('absolute flex justify-center z-30', 'w-[140%] left-[20%] top-[100%]')}
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
		</div>
	);
};

export default EventNavigationMenu;
