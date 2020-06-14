import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { default as classNames } from 'classnames';
import React from 'react';
import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../../icons';
import { capitalizeFirstLetter } from '../../../utils/string';
import { FullscreenLinkItem } from '../../navigation/FullscreenLinkItem';
import { LinkItem } from '../../navigation/LinkItem';
import { LogoLinkItem } from '../../navigation/LogoLinkItem';
import { NavigationWrapper } from '../../navigation/NavigationWrapper';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	event: Prisma.Event;
	roles: Prisma.EventRole[];
	pages: Prisma.EventPage[];
} & UseSignOutMutationData;

export const Unauthenticated: React.FC<Props> = (props) => {
	const { setIsOpen, roles, event, isOpen, pages } = props;

	return (
		<div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="w-full relative">
					<NavigationMenuPrimitive.List className="flex items-center justify-between w-full max-w-7xl m-auto h-14 px-3">
						<div>
							<LogoLinkItem />
						</div>

						<div className="h-full flex-row justify-end hidden lg:flex">
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

							<div className="flex-row space-x-8 font-medium flex lg:hidden">
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
						</div>

						<div className="h-full flex-row justify-end hidden lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/auth/signin`} label={'Sign in'} color={event.color} />
							</div>
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
