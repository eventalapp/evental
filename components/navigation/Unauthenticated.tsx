import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import React from 'react';
import { faBarsSquare } from '../../icons';
import { FullscreenLinkItem } from './FullscreenLinkItem';
import { LinkItem } from './LinkItem';
import { LogoLinkItem } from './LogoLinkItem';
import { NavigationWrapper } from './NavigationWrapper';

interface UnauthenticatedProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Unauthenticated: React.FC<UnauthenticatedProps> = (props) => {
	const { isOpen, setIsOpen } = props;

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
								<LinkItem link={`/pricing`} label={'Pricing'} />
								<LinkItem link={`/contact`} label={'Contact'} />
								<LinkItem link={`/guides`} label={'Guides'} />
								<LinkItem link={`/events`} label={'Events'} />
							</div>
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

						<div className="h-full flex-row justify-end hidden lg:flex">
							<div className="flex flex-row items-end">
								<LinkItem link={`/auth/signin`} label={'Sign in'} />
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
							link={`/events/`}
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
