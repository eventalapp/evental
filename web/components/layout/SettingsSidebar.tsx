import React from 'react';

import { SidebarLink } from './SidebarLink';

const separator = <div className="my-3 h-[1px] w-full bg-gray-300" />;

export const SettingsSidebar: React.FC = () => {
	return (
		<aside className="flex h-full w-52 flex-col p-2.5 py-7 md:py-14">
			<SidebarLink href="/" className="font-medium">
				{'<-'} Home
			</SidebarLink>

			{separator}

			<span className="px-2.5 text-xs font-bold text-gray-400">GENERAL</span>

			<SidebarLink href={`/settings`}>Profile</SidebarLink>
			<SidebarLink href={`/settings/notifications`}>Notifications</SidebarLink>
		</aside>
	);
};
