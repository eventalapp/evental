import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { UseSignOutMutationData } from '../../hooks/mutations/useSignOutMutation';
import { faBarsSquare } from '../../icons';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { FullscreenLinkItem } from '../events/navigation/Unauthenticated';
import { LinkButton } from '../form/LinkButton';
import { ProfileDropdown } from './dropdown';
import { NavigationWrapper } from './NavigationWrapper';

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
					<div className="hidden sm:block ml-7 space-x-7 text-md">
						<Link href={`/pricing`}>
							<a>Pricing</a>
						</Link>
						<Link href={`/contact`}>
							<a>Contact</a>
						</Link>
						<Link href={`/guides`}>
							<a>Guides</a>
						</Link>
					</div>
				</div>

				<div className="flex-row hidden space-x-7 text-md sm:flex items-center">
					<Link href="/events/attending">
						<a>Events</a>
					</Link>

					<Link href="/events/create">
						<LinkButton>Create Event</LinkButton>
					</Link>
					{user && <ProfileDropdown user={user} signOutMutation={signOutMutation} />}
				</div>

				<div className="flex-row flex space-x-8 font-medium sm:hidden text-gray-900">
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
