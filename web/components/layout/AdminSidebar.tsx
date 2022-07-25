import React from 'react';

import { useEvent } from '@eventalapp/shared/hooks';

import { SidebarLink, sidebarSkeleton } from './SidebarLink';

type Props = {
	eid: string;
};

const separator = <div className="my-3 h-[1px] w-full bg-gray-300" />;

export const AdminSidebar: React.FC<Props> = (props) => {
	const { eid } = props;
	const { data: event } = useEvent({ eid: String(eid) });

	return (
		<aside className="flex h-full w-52 flex-col p-2.5 py-7 md:py-14">
			{event ? (
				<SidebarLink href={`/events/${event.slug}`} className="font-medium">
					{'<-'} Back to event
				</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 text-xs font-bold text-gray-400">SCHEDULE</span>
			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/sessions`}>Sessions</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/sessions/categories`}>
					Categories
				</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/venues`}>Venues</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 text-xs font-bold text-gray-400 ">COMMUNITY</span>

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/attendees`}>Attendees</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/roles`}>Roles</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/messages`}>Messages</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 text-xs font-bold text-gray-400">GENERAL</span>

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin`}>Profile</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/pages`}>Pages</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/organizers`}>Organizers</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/billing`}>Billing</SidebarLink>
			) : (
				sidebarSkeleton
			)}
		</aside>
	);
};
