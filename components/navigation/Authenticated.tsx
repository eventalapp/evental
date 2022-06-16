import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

import { UseSignOutMutationData } from '../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../icons';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { LinkButton } from '../form/LinkButton';
import { FullscreenLinkItem } from './FullscreenLinkItem';
import { LinkItem } from './LinkItem';
import { LogoLinkItem } from './LogoLinkItem';
import { NavigationWrapper } from './NavigationWrapper';
import { ProfileDropdown } from './dropdown';

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
} & UseSignOutMutationData;

export const Authenticated: React.FC<Props> = (props) => {
	const { signOutMutation, isOpen, setIsOpen, user } = props;

	return (
		<div>
			<NavigationWrapper>
				<NavigationMenuPrimitive.Root className="relative w-full">
					<NavigationMenuPrimitive.List className="m-auto flex h-14 w-full max-w-7xl items-center justify-between px-3">
						<div>
							<LogoLinkItem />
						</div>

						<div className="hidden h-full flex-row justify-end lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/pricing`} label={'Pricing'} />
								<LinkItem link={`/contact`} label={'Contact'} />
								<LinkItem link={`/guides`} label={'Guides'} />
								<LinkItem link={`/events`} label={'Events'} />
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
							<div className="mr-6">
								<Link href="/events/create">
									<LinkButton>Create Event</LinkButton>
								</Link>
							</div>

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
					<div className="absolute top-4 right-4">
						{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
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
							link={`/events/attending`}
							label={'Events'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
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
		</div>
	);
};
