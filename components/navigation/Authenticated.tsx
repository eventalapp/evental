import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { ProfileDropdown } from './dropdown';

interface AuthenticatedProps {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	session: Session;
}

export const Authenticated: React.FC<AuthenticatedProps> = (props) => {
	const { session, className, isOpen, setIsOpen, ...restProps } = props;
	return (
		<nav
			{...restProps}
			className={classNames(
				'flex flex-row items-center justify-between w-full max-w-7xl m-auto h-14  px-3',
				className
			)}
		>
			<Link href="/">
				<a>
					<span className="flex flex-row items-center">
						<img src="/images/logo.svg" className="w-12 h-12 pr-3" alt="logo" />
						<strong
							className="text-2xl tracking-tight font-bold font-display"
							aria-label="evental homepage"
						>
							Evental
						</strong>
					</span>
				</a>
			</Link>

			<div className="flex-row hidden space-x-8 font-medium sm:flex pr-7 items-center">
				<Link href="/events">
					<a>Your Events</a>
				</Link>
				{session.user && <ProfileDropdown />}
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
		</nav>
	);
};
