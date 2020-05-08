import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { ProfileDropdown } from './dropdown';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { UseSignOutMutationData } from '../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { NavigationWrapper } from './NavigationWrapper';
import { LinkButton } from '../form/LinkButton';

type Props = {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	user: PasswordlessUser | undefined;
} & UseSignOutMutationData;

export const Authenticated: React.FC<Props> = (props) => {
	const { signOutMutation, className, isOpen, setIsOpen, user } = props;

	return (
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
							className="text-xl max-w-2xl tracking-tight font-bold font-display"
							aria-label="evental homepage"
						>
							Evental
						</strong>
					</span>
				</a>
			</Link>

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
	);
};
