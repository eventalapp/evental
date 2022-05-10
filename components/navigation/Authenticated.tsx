import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { ProfileDropdown } from './dropdown';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { UseSignOutMutationData } from '../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { NavigationWrapper } from './NavigationWrapper';
import { LinkButton } from '../form/LinkButton';
import classNames from 'classnames';
import { FullscreenLinkItem } from '../events/navigation/Unauthenticated';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
} & UseSignOutMutationData;

export const Authenticated: React.FC<Props> = (props) => {
	const { signOutMutation, className, isOpen, setIsOpen, user } = props;

	return (
		<div>
			<NavigationWrapper>
				<div className="flex-row flex items-center">
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
					<div className="hidden sm:block ml-7 space-x-7">
						<Link href={`/pricing`}>
							<a>Pricing</a>
						</Link>
						<Link href={`/contact`}>
							<a>Contact</a>
						</Link>
					</div>
				</div>

				<div className="flex-row hidden space-x-6 font-medium sm:flex items-center">
					<Link href="/events/attending">
						<a>My Events</a>
					</Link>

					<Link href="/events/create">
						<LinkButton>Create Event</LinkButton>
					</Link>
					{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
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
					<div className="absolute top-4 right-4">
						{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
					</div>
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
