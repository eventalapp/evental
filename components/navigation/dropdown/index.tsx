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
				<div className="relative h-10 w-10 rounded-md border border-gray-200 shadow-sm">
					<Image
						className="rounded-md"
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
				className="rounded-md border border-gray-200 bg-white p-2 text-left text-gray-900 shadow-sm"
				sideOffset={3}
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
				<div className="my-2 h-0.5 w-full bg-gray-200" />
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
				<Arrow className="text-gray-200" fill="currentColor" offset={15} />
			</Content>
		</Root>
	);
};
