import { Arrow, Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { UseSignOutMutationData } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { DropdownLink } from './Link';

type Props = {
	user: PasswordlessUser | undefined;
} & UseSignOutMutationData;

export const ProfileDropdown: React.FC<Props> = (props) => {
	const { user, signOutMutation } = props;

	return (
		<Root>
			<Trigger>
				<div className="rounded-full w-10 h-10 relative border-2 border-gray-100">
					<Image
						className="rounded-full"
						layout="fill"
						src={
							user?.image
								? `https://cdn.evental.app${user?.image}`
								: `https://cdn.evental.app/images/default-avatar.jpg`
						}
						alt={user?.name || ''}
					/>
				</div>
			</Trigger>
			<Content
				align="end"
				className="bg-white border border-gray-200 rounded-md py-2 px-2 text-gray-900 text-left"
				sideOffset={10}
			>
				<Item className="outline-none">
					<Link href={`/users/${user?.slug}`} passHref>
						<DropdownLink>Profile</DropdownLink>
					</Link>
				</Item>
				<Item className="outline-none">
					<Link href={`/users/${user?.slug}/schedule`} passHref>
						<DropdownLink className="mt-1">Schedule</DropdownLink>
					</Link>
				</Item>
				<Item className="outline-none">
					<Link href="/events/attending" passHref>
						<DropdownLink className="mt-1">Events</DropdownLink>
					</Link>
				</Item>
				<Item className="outline-none">
					<Link href="/settings" passHref>
						<DropdownLink className="mt-1">Settings</DropdownLink>
					</Link>
				</Item>
				<div className="h-0.5 w-full my-2 bg-gray-200" />
				<Item className="outline-none">
					<DropdownLink
						className="text-red-600"
						onClick={() => {
							signOutMutation.mutate();
						}}
					>
						Sign out
					</DropdownLink>
				</Item>
				<Arrow className="text-gray-200" fill="currentColor" offset={14} />
			</Content>
		</Root>
	);
};
