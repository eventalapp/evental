import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { default as classNames } from 'classnames';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSignOutMutation } from '../../hooks/mutations/useSignOutMutation';
import { useEventQuery } from '../../hooks/queries/useEventQuery';
import { usePagesQuery } from '../../hooks/queries/usePagesQuery';
import { useRolesQuery } from '../../hooks/queries/useRolesQuery';
import { useUser } from '../../hooks/queries/useUser';
import { faBarsSquare } from '../../utils/icons';
import { capitalizeFirstLetter } from '../../utils/string';
import { ProfileDropdown } from '../authentication/ProfileDropdown';
import { AuthContainer } from '../navigation/AuthContainer';
import { FullscreenLinkItem } from '../navigation/FullscreenLinkItem';
import { HamburgerContainer } from '../navigation/HamburgerContainer';
import { LinkContainer } from '../navigation/LinkContainer';
import { LinkItem } from '../navigation/LinkItem';
import { LogoLinkItem } from '../navigation/LogoLinkItem';
import { NavigationWrapper } from '../navigation/NavigationWrapper';

type Props = {
	eid: string;
};

const LinkSkeleton = <Skeleton className="mx-2 mb-2 h-7 w-20" />;

export const EventNavigation: React.FC<Props> = (props) => {
	const { eid } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { pages, isPagesLoading } = usePagesQuery(String(eid));

	const isLoading = isPagesLoading || isEventLoading || isRolesLoading;

	return (
		<div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="relative w-full">
					<NavigationMenuPrimitive.List className="m-auto grid h-14 w-full max-w-7xl grid-cols-2 px-3 lg:grid-cols-9">
						{/* Logos (Desktop & Mobile) */}
						<div className="col-span-1 lg:col-span-2">
							<LogoLinkItem color={event?.color} />
						</div>

						{/* Links (Desktop only) */}
						<LinkContainer>
							<div className="flex flex-row items-end">
								{!isLoading && event ? (
									<LinkItem link={`/events/${event.slug}`} label={'Schedule'} color={event.color} />
								) : (
									LinkSkeleton
								)}

								{!isLoading && event && roles ? (
									roles.map((role) => (
										<LinkItem
											key={role.id}
											link={`/events/${event.slug}/roles/${role.slug}`}
											label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
											color={event.color}
										/>
									))
								) : (
									<>
										{LinkSkeleton}
										{LinkSkeleton}
										{LinkSkeleton}
									</>
								)}

								{!isLoading && event && pages
									? pages
											.filter((page) => page.topLevel)
											.map((page) => (
												<LinkItem
													key={page.id}
													link={`/events/${event.slug}/pages/${page.slug}`}
													label={page.name}
													color={event.color}
												/>
											))
									: LinkSkeleton}
							</div>
						</LinkContainer>

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
								{!isUserLoading && !user && (
									<LinkItem link={`/auth/signin`} label={'Sign in'} color={event?.color} />
								)}
							</div>
							<div className="flex flex-row items-center">
								{user ? (
									<NavigationMenuPrimitive.Item className="flex">
										<ProfileDropdown user={user} signOutMutation={signOutMutation} />
									</NavigationMenuPrimitive.Item>
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
							<ProfileDropdown user={user} signOutMutation={signOutMutation} />
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

						{event ? (
							<FullscreenLinkItem
								index={1}
								link={`/events/${event.slug}`}
								label={'Sessions'}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						) : (
							<Skeleton className="w-20" />
						)}

						{event ? (
							<FullscreenLinkItem
								index={2}
								link={`/events/${event.slug}/venues`}
								label={'Venues'}
								onClick={() => {
									setIsOpen(false);
								}}
							/>
						) : (
							<Skeleton className="w-20" />
						)}

						{event && roles ? (
							roles.map((role, i) => (
								<FullscreenLinkItem
									index={i + 3}
									key={role.id}
									link={`/events/${event.slug}/roles/${role.slug}`}
									label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
									onClick={() => {
										setIsOpen(false);
									}}
								/>
							))
						) : (
							<Skeleton className="w-20" />
						)}

						{event && pages ? (
							pages
								.filter((page) => page.topLevel)
								.map((page) => (
									<FullscreenLinkItem
										key={page.id}
										link={`/events/${event.slug}/pages/${page.slug}`}
										label={page.name}
										onClick={() => {
											setIsOpen(false);
										}}
									/>
								))
						) : (
							<Skeleton className="w-20" />
						)}
					</div>
				</div>
			</ul>
		</div>
	);
};