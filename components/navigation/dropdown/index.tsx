import { Arrow, Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { DropdownLink } from './Link';
import Image from 'next/image';

export const ProfileDropdown: React.FC = () => {
	const { data: session } = useSession();

	return (
		<Root>
			<Trigger>
				<div className="rounded-full w-8 h-8 relative border-2 border-gray-100">
					<Image
						className="rounded-full"
						layout="fill"
						src={
							session?.user?.image
								? `https://cdn.evental.app${session?.user?.image}`
								: `https://cdn.evental.app/images/default-avatar.jpg`
						}
						alt={session?.user?.name || ''}
					/>
				</div>
			</Trigger>
			<Content
				align="end"
				className="bg-white border border-gray-200 rounded-md py-2 px-2 text-gray-900 text-left"
				sideOffset={10}
			>
				<Item className="outline-none">
					<Link href="/events" passHref>
						<DropdownLink>Events</DropdownLink>
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
							signOut({ callbackUrl: '/auth/signin' }).catch((error) => console.error(error));
						}}
					>
						Sign out
					</DropdownLink>
				</Item>
				<Arrow className="text-gray-200" fill="currentColor" offset={10} />
			</Content>
		</Root>
	);
};
