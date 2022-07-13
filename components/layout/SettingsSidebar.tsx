import router from 'next/router';
import React from 'react';

import { SidebarLink } from './SidebarLink';

const separator = <div className="h-[1px] w-full my-3 bg-gray-300" />;

export const SettingsSidebar: React.FC = () => {
	return (
		<aside className="w-52 p-2.5 h-full py-7 md:py-14 flex flex-col">
			<SidebarLink
				onClick={() => {
					router.back();
				}}
				className="font-medium"
			>
				{'<-'} Back
			</SidebarLink>

			{separator}

			<span className="px-2.5 font-bold text-xs text-gray-400">GENERAL</span>

			<SidebarLink href={`/settings`}>Profile</SidebarLink>
			<SidebarLink href={`/settings/notifications`}>Notifications</SidebarLink>
		</aside>
	);
};
