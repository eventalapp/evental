import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useUser } from '@eventalapp/shared/hooks';
import { faBarsSquare } from '@eventalapp/shared/utils/icons';

import { ProfileDropdown } from '../authentication/ProfileDropdown';
import { LinkButton } from '../primitives/LinkButton';
import { AuthContainer } from './AuthContainer';
import { FullscreenLinkItem } from './FullscreenLinkItem';
import { HamburgerContainer } from './HamburgerContainer';
import { LinkItem } from './LinkItem';
import { LogoLinkItem } from './LogoLinkItem';
import { NavigationWrapper } from './NavigationWrapper';

const FreeEventalPro = (
	<div className="w-full bg-green-500">
		<Link href={`/pricing`}>
			<a className="m-auto block py-1 text-center text-sm text-white">
				Upgrade your event to PRO for free! Click to learn more
			</a>
		</Link>
	</div>
);

export const Navigation: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: user, isLoading: isUserLoading } = useUser();

	return (
		<>
			{FreeEventalPro}
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="relative w-full">
					<NavigationMenuPrimitive.List className="m-auto grid h-14 w-full max-w-7xl grid-cols-2 px-3 lg:grid-cols-9">
						{/* Logos (Desktop & Mobile) */}
						<div className="col-span-1 lg:col-span-2">
							<LogoLinkItem />
						</div>

						{/* Links (Desktop only) */}
						<div className="col-span-5 hidden h-full flex-row justify-center lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/pricing`} label={'Pricing'} />
								<LinkItem link={`/contact`} label={'Contact'} />
								<LinkItem link={`/guides`} label={'Guides'} />
								<LinkItem link={`/events`} label={'Events'} />
							</div>
						</div>

						{/* Hamburger (Mobile only)*/}
						<HamburgerContainer>
							<FontAwesomeIcon
								className="cursor-pointer text-gray-900"
								size="2x"
								fill="currentColor"
								icon={faBarsSquare}
								onClick={() => {
									setIsOpen(true);
								}}
							/>
						</HamburgerContainer>

						{/* User Icon + Create Event (Desktop only) */}
						<AuthContainer>
							<div className="flex flex-row items-end">
								{!isUserLoading && !user && <LinkItem link={`/auth/signin`} label={'Sign in'} />}
							</div>
							<div className="flex flex-row items-center">
								{user ? (
									<>
										<NavigationMenuPrimitive.Item className="mr-6">
											<Link href="/events/create" passHref>
												<LinkButton variant="primary">Create Event</LinkButton>
											</Link>
										</NavigationMenuPrimitive.Item>
										<NavigationMenuPrimitive.Item className="flex">
											<ProfileDropdown user={user} />
										</NavigationMenuPrimitive.Item>
									</>
								) : (
									isUserLoading && <Skeleton className="h-10 w-10" containerClassName="flex" />
								)}
							</div>
						</AuthContainer>
					</NavigationMenuPrimitive.List>
				</NavigationMenuPrimitive.Root>
			</NavigationWrapper>

			<ul
				className={classNames(
					'fixed top-0 bottom-0 z-50 w-full bg-white transition-all duration-100',
					isOpen ? 'right-0' : '-right-full'
				)}
			>
				<div className="relative h-full w-full">
					<div className="absolute top-4 right-4">
						{user ? (
							<ProfileDropdown user={user} />
						) : (
							isUserLoading && <Skeleton className="h-10 w-10" />
						)}
					</div>

					<div className="flex h-full w-full flex-col items-center justify-center">
						<button
							onClick={() => {
								setIsOpen(false);
							}}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mb-3 h-8 w-8 cursor-pointer"
								size="2x"
								icon={faXmark}
							/>
						</button>

						{!user && !isUserLoading && (
							<FullscreenLinkItem
								index={0}
								link={`/auth/signin`}
								label={'Sign In'}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						)}

						{user ? (
							<FullscreenLinkItem
								index={0}
								link={`/events/attending`}
								label={'Events'}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						) : (
							<FullscreenLinkItem
								index={0}
								link={`/events`}
								label={'Events'}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						)}

						<FullscreenLinkItem
							index={1}
							link={`/pricing`}
							label={'Pricing'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={2}
							link={`/contact`}
							label={'Contact'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={3}
							link={`/guides`}
							label={'Guides'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={4}
							link={`/`}
							label={'Home'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			</ul>
		</>
	);
};
