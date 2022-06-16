import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { default as classNames } from 'classnames';
import React from 'react';
import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../../icons';
import { capitalizeFirstLetter } from '../../../utils/string';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { ProfileDropdown } from '../../navigation/dropdown';
import { FullscreenLinkItem } from '../../navigation/FullscreenLinkItem';
import { LinkItem } from '../../navigation/LinkItem';
import { LogoLinkItem } from '../../navigation/LogoLinkItem';
import { NavigationWrapper } from '../../navigation/NavigationWrapper';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
	event: Prisma.Event;
	roles: Prisma.EventRole[];
	pages: Prisma.EventPage[];
} & UseSignOutMutationData;

export const Authenticated: React.FC<Props> = (props) => {
	const { signOutMutation, setIsOpen, isOpen, user, roles, event, pages } = props;

	return (
		<div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="relative w-full">
					<NavigationMenuPrimitive.List className="flex justify-between items-center px-3 m-auto w-full max-w-7xl h-14">
						<div>
							<LogoLinkItem />
						</div>

						<div className="hidden flex-row justify-end h-full lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/events/${event.slug}`} label={'Sessions'} color={event.color} />
								<LinkItem
									link={`/events/${event.slug}/venues`}
									label={'Venues'}
									color={event.color}
								/>

								{roles.map((role) => (
									<LinkItem
										key={role.id}
										link={`/events/${event.slug}/roles/${role.slug}`}
										label={`${capitalizeFirstLetter(role.name.toLowerCase())}s`}
										color={event.color}
									/>
								))}

								{pages
									.filter((page) => page.topLevel)
									.map((page) => (
										<LinkItem
											key={page.id}
											link={`/events/${event.slug}/pages/${page.slug}`}
											label={page.name}
											color={event.color}
										/>
									))}
							</div>
						</div>

						<div className="flex flex-row space-x-8 font-medium lg:hidden">
							<FontAwesomeIcon
								className="text-gray-900 cursor-pointer"
								size="2x"
								fill="currentColor"
								icon={faBarsSquare}
								onClick={() => {
									setIsOpen(true);
								}}
							/>
						</div>

						<div className="hidden justify-end items-center lg:flex">
							<NavigationMenuPrimitive.Item className="flex">
								{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
							</NavigationMenuPrimitive.Item>
						</div>
					</NavigationMenuPrimitive.List>
				</NavigationMenuPrimitive.Root>
			</NavigationWrapper>

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
					<div className="flex flex-col justify-center items-center w-full h-full">
						<button
							onClick={() => {
								setIsOpen(false);
							}}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="mb-3 w-5 h-5 cursor-pointer"
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
