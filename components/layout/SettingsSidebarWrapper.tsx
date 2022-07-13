import React from 'react';

import { SettingsSidebar } from './SettingsSidebar';

export const SettingsSidebarWrapper: React.FC = (props) => {
	const { children } = props;

	return (
		<div className="flex flex-row overflow-hidden absolute inset-0">
			<div
				style={{ flex: '1 0 218px' }}
				className="flex justify-end flex-row bg-gray-100 overflow-x-hidden overflow-y-scroll"
			>
				<SettingsSidebar />
			</div>
			<div style={{ flex: '1 1 800px' }} className="static overflow-x-hidden overflow-y-scroll">
				<div className="flex justify-start flex-col">{children}</div>
			</div>
		</div>
	);
};
