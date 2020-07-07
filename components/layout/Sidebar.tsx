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
			{event ? (
				<SidebarLink href={`/events/${event.slug}`} className="font-medium">
					{'<-'} Back to event
				</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">SCHEDULE</span>
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

			<span className="px-2.5 font-bold text-xs text-gray-400">ATTENDEE</span>

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
				<SidebarLink href={`/events/${event.slug}/admin/organizers`}>Organizers</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">MISC</span>

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/pages`}>Pages</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">INTERACTION</span>

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/messages`}>Messages</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">SETTINGS</span>
			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin`}>General</SidebarLink>
			) : (
				sidebarSkeleton
			)}

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">BILLING</span>

			{event ? (
				<SidebarLink href={`/events/${event.slug}/admin/billing`}>Billing</SidebarLink>
			) : (
				sidebarSkeleton
			)}
		</aside>
	);
};
