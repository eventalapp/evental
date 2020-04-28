import { Arrow, Content, Item, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { DropdownLink } from './Link';
import ImageWithFallback from '../../ImageWithFallback';

export const ProfileDropdown: React.FC = () => {
	const { data: session } = useSession();

	return (
		<Root>
			<Trigger>
				<div className="w-8 h-8 relative">
					<ImageWithFallback
						className="rounded-full"
						layout="fill"
						src={session?.user?.image || ''}
						alt={session?.user?.name || ''}
						fallbackSrc={`https://api.adorable.io/avatars/285/${
							session?.user?.name || 'unknown'
						}.png`}
					/>
				</div>
			</Trigger>
			<Content
				align="end"
				className="bg-gray-100 border border-gray-200 rounded-md py-2 px-2 text-gray-900 text-left"
				sideOffset={10}
			>
				<Item className="outline-none">
					<Link href="/events" passHref>
						<DropdownLink className="">Your Events</DropdownLink>
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
