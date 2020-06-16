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
				<div className="relative w-10 h-10 rounded-full border border-gray-200 shadow-sm">
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
				className="p-2 text-left text-gray-900 bg-white rounded-md border border-gray-200 shadow-sm"
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
				<div className="my-2 w-full h-0.5 bg-gray-200" />
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
