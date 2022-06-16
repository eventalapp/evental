import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import React from 'react';

type Props = {};

const NavigationMenu = (props: Props) => {
	return (
		<NavigationMenuPrimitive.Root className="relative">
			<NavigationMenuPrimitive.List className="flex flex-row space-x-2 rounded-lg bg-white p-2 dark:bg-gray-800">
				<NavigationMenuPrimitive.Item>
					<NavigationMenuPrimitive.Trigger
						className={cx(
							'rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900',
							'text-sm font-medium',
							'text-gray-700 dark:text-gray-100',
							'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
						)}
					>
						Overview
					</NavigationMenuPrimitive.Trigger>

					<NavigationMenuPrimitive.Content
						className={cx(
							'absolute top-0 left-0 w-auto rounded-lg',
							'radix-motion-from-start:animate-enter-from-left',
							'radix-motion-from-end:animate-enter-from-right',
							'radix-motion-to-start:animate-exit-to-left',
							'radix-motion-to-end:animate-exit-to-right'
						)}
					>
						<div className="w-[21rem] p-3 lg:w-[23rem]">
							<div className="grid grid-cols-6 gap-4">
								<div className="col-span-2 w-full rounded-md bg-gray-100 p-4 dark:bg-gray-900"></div>

								<div className="col-span-4 flex w-full flex-col space-y-3 rounded-md bg-gray-100 p-4 dark:bg-gray-900">
									<div className="h-12 w-full rounded-md bg-white dark:bg-gray-700"></div>
									<div className="h-12 w-full rounded-md bg-white dark:bg-gray-700"></div>
									<div className="h-12 w-full rounded-md bg-white dark:bg-gray-700"></div>
									<div className="h-12 w-full rounded-md bg-white dark:bg-gray-700"></div>
								</div>
							</div>
						</div>
					</NavigationMenuPrimitive.Content>
				</NavigationMenuPrimitive.Item>

				<NavigationMenuPrimitive.Item>
					<NavigationMenuPrimitive.Trigger
						className={cx(
							'rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900',
							'text-sm font-medium text-gray-700 dark:text-gray-100',
							'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
						)}
					>
						Resources
					</NavigationMenuPrimitive.Trigger>

					<NavigationMenuPrimitive.Content
						className={cx(
							'absolute top-0 left-0 w-auto rounded-lg',
							'radix-motion-from-start:animate-enter-from-left',
							'radix-motion-from-end:animate-enter-from-right',
							'radix-motion-to-start:animate-exit-to-left',
							'radix-motion-to-end:animate-exit-to-right'
						)}
					>
						<div className="w-[16rem] p-3 lg:w-[18rem]">
							<div className="flex w-full flex-col space-y-2">
								<NavigationMenuPrimitive.Link
									className={cx(
										'w-full rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900',
										'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
									)}
									href="https://tailwindcss.com"
								>
									<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
										Tailwind CSS
									</span>

									<div className="mt-1 text-sm text-gray-700 dark:text-gray-400">
										A utility-first CSS framework for rapidly building custom user interfaces.
									</div>
								</NavigationMenuPrimitive.Link>

								<NavigationMenuPrimitive.Link
									className={cx(
										'w-full rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900',
										'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
									)}
									href="https://www.radix-ui.com"
								>
									<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
										Radix UI
									</span>

									<div className="mt-1 text-sm text-gray-700 dark:text-gray-400">
										An open-source UI component library for building high-quality, accessible design
										systems and web apps.
									</div>
								</NavigationMenuPrimitive.Link>
							</div>
						</div>
					</NavigationMenuPrimitive.Content>
				</NavigationMenuPrimitive.Item>

				<NavigationMenuPrimitive.Item
					className={cx(
						'rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900',
						'text-sm font-medium font-medium text-gray-700 dark:text-gray-100'
					)}
				>
					<NavigationMenuPrimitive.Link href="https://github.com/ecklf/tailwindcss-radix">
						GitHub
					</NavigationMenuPrimitive.Link>
				</NavigationMenuPrimitive.Item>

				<NavigationMenuPrimitive.Indicator
					className={cx(
						'z-10',
						'top-[100%] flex h-2 items-end justify-center overflow-hidden',
						'radix-state-visible:animate-fade-in',
						'radix-state-hidden:animate-fade-out',
						'transition-[width_transform] duration-[250ms] ease-[ease]'
					)}
				>
					<div className="relative top-1 h-2 w-2 rotate-45 bg-white dark:bg-gray-800" />
				</NavigationMenuPrimitive.Indicator>
			</NavigationMenuPrimitive.List>

			<div
				className={cx('absolute flex justify-center', 'left-[-20%] top-[100%] w-[140%]')}
				style={{
					perspective: '2000px'
				}}
			>
				<NavigationMenuPrimitive.Viewport
					className={cx(
						'relative mt-2 overflow-hidden rounded-md bg-white shadow-lg dark:bg-gray-800',
						'w-radix-navigation-menu-viewport',
						'h-radix-navigation-menu-viewport',
						'radix-state-open:animate-scale-in-content',
						'radix-state-closed:animate-scale-out-content',
						'origin-[top_center] transition-[width_height] duration-300 ease-[ease]'
					)}
				/>
			</div>
		</NavigationMenuPrimitive.Root>
	);
};

export default NavigationMenu;
