import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

import { AdminSidebar } from './Sidebar';

type SidebarWrapperProps = {
	className?: string;
	eid: string;
};

export const SidebarWrapper: React.FC<SidebarWrapperProps> = (props) => {
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
				<div className="flex justify-start flex-row">
					{children}
					<div className="relative mr-10">
						<Link href={`/events/${eid}`}>
							<a className="py-7 md:py-14 flex items-center flex-col fixed">
								<div className="rounded-full border-2 border-gray-500 p-2 flex items-center justify-center">
									<FontAwesomeIcon
										fill="currentColor"
										className="h-5 w-5 text-gray-500"
										size="1x"
										icon={faXmark}
									/>
								</div>
								<span className="text-tiny font-bold mt-1 text-gray-500">ESC</span>
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
