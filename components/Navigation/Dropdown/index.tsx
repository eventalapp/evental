import { Arrow, Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { DropdownLink } from './Link';

export const ProfileDropdown: React.FC = () => {
	const { data: session } = useSession();

	return (
		<Root>
			<Trigger>
				<img
					className="w-7 rounded-full"
					src={session?.user?.image || undefined}
					alt={session?.user?.name || undefined}
				/>
			</Trigger>
			<Content
				align="end"
				className="bg-gray-700 border border-gray-500 rounded-lg py-2 px-2 text-white text-left"
				sideOffset={10}
			>
				<Item className="outline-none">
					<Link href="/dashboard" passHref>
						<DropdownLink className="mt-1">Dashboard</DropdownLink>
					</Link>
				</Item>
				<div className="h-0.5 w-full my-2 bg-gray-600" />
				<Item className="outline-none">
					<DropdownLink
						className="text-red-500"
						onClick={() => {
							signOut({ callbackUrl: '/auth/signin' }).catch((err) => console.error(err));
						}}
					>
						Sign out
					</DropdownLink>
				</Item>
				<Arrow className="text-gray-500" fill="currentColor" offset={7.5} />
			</Content>
		</Root>
	);
};
