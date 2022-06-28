import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { default as classNames } from 'classnames';
import Color from 'color';
import Link from 'next/link';
import React from 'react';

import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../../icons';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { FullscreenLinkItem } from '../../navigation/FullscreenLinkItem';
import { LinkItem } from '../../navigation/LinkItem';
import { LogoLinkItem } from '../../navigation/LogoLinkItem';
import { NavigationWrapper } from '../../navigation/NavigationWrapper';
import { ProfileDropdown } from '../../radix/components/ProfileDropdown';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
	event: Prisma.Event;
} & UseSignOutMutationData;

export const SettingsAuthenticated: React.FC<Props> = (props) => {
	const { signOutMutation, setIsOpen, user, event, isOpen } = props;

	return (
		<div>
			<div
				className="w-full"
				style={{
					backgroundColor: event.color,
					color: Color(event.color).isLight() ? '#000' : '#FFF'
				}}
			>
				<Link href={`/events/${event.slug}`}>
					<a className="m-auto block py-1 text-center text-sm">
						You are in admin mode <span className="font-medium">(Click to exit)</span>
					</a>
				</Link>
			</div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="w-full">
					<NavigationMenuPrimitive.List className="m-auto flex h-14 w-full max-w-7xl items-center justify-between px-3">
						<div>
							<LogoLinkItem color={event.color} />
						</div>

						<div className="hidden h-full flex-row justify-end lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem
									link={`/events/${event.slug}/admin/sessions`}
									label={'Sessions'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/sessions/types`}
									label={'Types'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/venues`}
									label={'Venues'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/attendees`}
									label={'Attendees'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/roles`}
									label={'Roles'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/organizers`}
									label={'Organizers'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin/pages`}
									label={'Pages'}
									color={event.color}
								/>
								<LinkItem
									link={`/events/${event.slug}/admin`}
									label={'Settings'}
									color={event.color}
								/>
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

						<div className="hidden items-center justify-end lg:flex">
							<NavigationMenuPrimitive.Item className="flex">
								{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
							</NavigationMenuPrimitive.Item>
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
							link={`/events/${event.slug}/admin/sessions`}
							label={'Sessions'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={0}
							link={`/events/${event.slug}/admin/sessions/types`}
							label={'Types'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={1}
							link={`/events/${event.slug}/admin/venues`}
							label={'Venues'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={2}
							link={`/events/${event.slug}/admin/attendees`}
							label={'Attendees'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={3}
							link={`/events/${event.slug}/admin/roles`}
							label={'Roles'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={4}
							link={`/events/${event.slug}/admin/organizers`}
							label={'Organizers'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={5}
							link={`/events/${event.slug}/admin/pages`}
							label={'Pages'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={6}
							link={`/events/${event.slug}/admin`}
							label={'Settings'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			</ul>
		</div>
	);
};
