import Link from 'next/link';
import React from 'react';
import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import cx from 'classnames';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { capitalizeFirstLetter } from '../../../utils/string';
import Prisma from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	event: Prisma.Event;
	roles: Prisma.EventRole[];
} & UseSignOutMutationData;

export const FullscreenLinkItem: React.FC<{
	link: string;
	label: string;
	index: number;
	onClick: () => void;
}> = (props) => {
	const { link, label, index, onClick } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<a
				className={cx(
					'cursor-pointer pb-1.5 border-b-2',
					router.asPath == link ? 'border-primary' : 'border-transparent'
				)}
				onClick={onClick}
				onKeyDown={onClick}
				role="button"
				tabIndex={index}
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
	const { setIsOpen, roles, event, isOpen, signOutMutation } = props;

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
							link={`/events/${event.slug}`}
							label={'Sessions'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={1}
							link={`/events/${event.slug}/venues`}
							label={'Venues'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>

						{roles.map((role, i) => (
							<FullscreenLinkItem
								index={i + 2}
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
