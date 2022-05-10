import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { NavigationWrapper } from './NavigationWrapper';
import classNames from 'classnames';
import { FullscreenLinkItem } from '../events/navigation/Unauthenticated';

interface UnauthenticatedProps {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Unauthenticated: React.FC<UnauthenticatedProps> = (props) => {
	const { className, isOpen, setIsOpen } = props;

	return (
		<div>
			<NavigationWrapper>
				<Link href="/">
					<a>
						<span className="flex flex-row items-center">
							<img
								src="https://cdn.evental.app/images/logo.svg"
								className="w-12 h-12 pr-3"
								alt="logo"
							/>
							<strong
								className="text-2xl tracking-tight font-bold font-display"
								aria-label="evental homepage"
							>
								Evental
							</strong>
						</span>
					</a>
				</Link>

				<div className="flex-row hidden space-x-8 font-medium sm:flex pr-7">
					<Link href="/events">
						<a>Events</a>
					</Link>
					<Link href={`/auth/signin`}>
						<a>Sign in</a>
					</Link>
				</div>

				<div className="flex-row flex space-x-8 font-medium sm:hidden">
					<FontAwesomeIcon
						className="py-2 cursor-pointer"
						size="2x"
						icon={faBars}
						onClick={() => {
							setIsOpen(true);
						}}
					/>
				</div>
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
							link={`/events/attending`}
							label={'My Events'}
							onClick={() => {
								setIsOpen(false);
							}}
						/>
						<FullscreenLinkItem
							index={0}
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
