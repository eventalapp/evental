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
						<div className="py-7 md:py-14 fixed">
							<Link href={`/events/${eid}`}>
								<a className="flex items-center flex-col group text-gray-500 hover:text-gray-700">
									<div className="rounded-full border-2 group-hover:border-gray-700 border-gray-500 p-2 flex items-center justify-center transition duration-100">
										<FontAwesomeIcon
											fill="currentColor"
											className="h-5 w-5 transition duration-100"
											size="1x"
											icon={faXmark}
										/>
									</div>
									<span className="text-tiny font-bold mt-1 transition duration-100">ESC</span>
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
