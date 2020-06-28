import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { default as classNames } from 'classnames';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSignOutMutation } from '../../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../../icons';
import { capitalizeFirstLetter } from '../../../utils/string';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { FullscreenLinkItem } from '../../navigation/FullscreenLinkItem';
import { LinkItem } from '../../navigation/LinkItem';
import { LogoLinkItem } from '../../navigation/LogoLinkItem';
import { NavigationWrapper } from '../../navigation/NavigationWrapper';
import { ProfileDropdown } from '../../radix/components/ProfileDropdown';

type Props = {
	event?: Prisma.Event;
	roles?: Prisma.EventRole[];
	pages?: Prisma.EventPage[];
	user?: PasswordlessUser;
};

export const EventNavigation: React.FC<Props> = (props) => {
	const { roles, event, user, pages, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();

	return (
		<div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="relative w-full">
					<NavigationMenuPrimitive.List className="m-auto flex h-14 w-full max-w-7xl items-center justify-between px-3">
						<div>
							<LogoLinkItem color={event?.color} />
						</div>

						<div className="hidden h-full flex-row justify-end lg:flex">
							<div className="flex flex-row items-end">
								{event ? (
									<LinkItem link={`/events/${event.slug}`} label={'Sessions'} color={event.color} />
								) : (
									<Skeleton className="w-20 h-7 mb-2 mx-2" />
								)}

								{event ? (
									<LinkItem
										link={`/events/${event.slug}/venues`}
										label={'Venues'}
										color={event.color}
									/>
								) : (
									<Skeleton className="w-20 h-7 mb-2 mx-2" />
								)}

								{event && roles ? (
									roles.map((role) => (
										<LinkItem
											key={role.id}
											link={`/events/${event.slug}/roles/${role.slug}`}
											label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
											color={event.color}
										/>
									))
								) : (
									<Skeleton className="w-20 h-7 mb-2 mx-2" />
								)}

								{event && pages ? (
									pages
										.filter((page) => page.topLevel)
										.map((page) => (
											<LinkItem
												key={page.id}
												link={`/events/${event.slug}/pages/${page.slug}`}
												label={page.name}
												color={event.color}
											/>
										))
								) : (
									<Skeleton className="w-20 h-7 mb-2 mx-2" />
								)}
							</div>
						</div>

						<div className="flex flex-row space-x-8 font-medium lg:hidden">
							<FontAwesomeIcon
								className="cursor-pointer text-gray-900"
								size="2x"
								fill="currentColor"
								icon={faBarsSquare}
								onClick={() => {
									setIsOpen(true);
								}}
							/>
						</div>

						<div className="hidden h-full flex-row justify-end lg:flex">
							<div className="flex flex-row items-end">
								{user === undefined && (
									<LinkItem link={`/auth/signin`} label={'Sign in'} color={event?.color} />
								)}
							</div>
							<div className="flex flex-row items-center">
								{user ? (
									<ProfileDropdown user={user} signOutMutation={signOutMutation} />
								) : (
									<Skeleton className="h-10 w-10" />
								)}
							</div>
						</div>
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
							<Skeleton className="h-10 w-10" />
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
								className="mb-3 h-5 w-5 cursor-pointer"
								size="2x"
								icon={faXmark}
							/>
						</button>

						<FullscreenLinkItem
							index={0}
							link={`/ath/signin`}
							label={'Sign In'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>

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
								.map((page, i) => (
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
