import React from 'react';

import { AdminSidebar } from './AdminSidebar';

type AdminSidebarWrapperProps = {
	className?: string;
	eid: string;
};

export const AdminSidebarWrapper: React.FC<AdminSidebarWrapperProps> = (props) => {
	const { children, eid } = props;

	return (
		<div className="flex flex-row overflow-hidden absolute inset-0">
			<div
				style={{ flex: '1 0 218px' }}
				className="flex justify-end flex-row bg-gray-100 overflow-x-hidden overflow-y-scroll"
			>
				<AdminSidebar eid={String(eid)} />
			</div>
			<div style={{ flex: '1 1 800px' }} className="static overflow-x-hidden overflow-y-scroll">
				<div className="flex justify-start flex-col">{children}</div>
			</div>
		</div>
	);
};
