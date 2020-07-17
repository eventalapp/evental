import React from 'react';

import { SettingsSidebar } from './SettingsSidebar';

export const SettingsSidebarWrapper: React.FC = (props) => {
	const { children } = props;

	return (
		<div className="absolute inset-0 flex flex-row overflow-hidden">
			<div
				style={{ flex: '1 0 218px' }}
				className="flex flex-row justify-end overflow-x-hidden overflow-y-scroll bg-gray-100"
			>
				<SettingsSidebar />
			</div>
			<div style={{ flex: '1 1 800px' }} className="static overflow-x-hidden overflow-y-scroll">
				<div className="flex flex-col justify-start">{children}</div>
			</div>
		</div>
	);
};
