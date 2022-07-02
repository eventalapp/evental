import Link from 'next/link';
import React from 'react';

import { useEventQuery } from '../../hooks/queries/useEventQuery';
import { SidebarLink, sidebarSkeleton } from './SidebarLink';

type Props = {
	eid: string;
};

const separator = <div className="h-[1px] w-full my-3 bg-gray-300" />;

export const AdminSidebar: React.FC<Props> = (props) => {
	const { eid } = props;
	const { event } = useEventQuery(eid);

	return (
		<aside className="w-52 p-2.5 h-full py-7 md:py-14 flex flex-col">
			<span className="px-2.5 font-bold text-xs text-gray-400">DATA</span>
			{event ? (
				<Link href={`/events/${event.slug}/admin/sessions`} passHref>
					<SidebarLink>Sessions</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<Link href={`/events/${event.slug}/admin/sessions/categories`} passHref>
					<SidebarLink>Categories</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/venues`} passHref>
					<SidebarLink>Venues</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/attendees`} passHref>
					<SidebarLink>Attendees</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/roles`} passHref>
					<SidebarLink>Roles</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/organizers`} passHref>
					<SidebarLink>Organizers</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/pages`} passHref>
					<SidebarLink>Pages</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/roles`} passHref>
					<SidebarLink>Roles</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
			{event ? (
				<Link href={`/events/${event.slug}/admin/pages`} passHref>
					<SidebarLink>Pages</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">EVENT SETTINGS</span>
			{event ? (
				<Link href={`/events/${event.slug}/admin`} passHref>
					<SidebarLink>General</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<Link href={`/events/${event.slug}/admin`} passHref>
					<SidebarLink>Branding</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">BILLING SETTINGS</span>

			{event ? (
				<Link href={`/events/${event.slug}/admin/billing`} passHref>
					<SidebarLink>Billing</SidebarLink>
				</Link>
			) : (
				sidebarSkeleton
			)}
		</aside>
	);
};
