import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUser';
import { NotFound } from '../error/NotFound';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	attendees?: AttendeeWithUser[];
	admin?: boolean;
};

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, attendees, admin = false } = props;

	if (attendees && attendees?.length === 0) {
		return <NotFound message="No attendees found." />;
	}

	return (
		<div>
			<ul className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">
				{attendees
					? attendees.map(
							(attendee) =>
								attendee &&
								attendee.user &&
								attendee.role && (
									<Tooltip message={`View ${attendee.user.name}'s profile`} key={attendee.id}>
										<li>
											<Link
												href={`/events/${eid}${admin ? '/admin' : ''}/attendees/${
													attendee.user.slug
												}`}
											>
												<a className="flex h-full flex-col items-center justify-start">
													<div
														className={classNames(
															'relative mb-2 rounded-md border border-gray-100 shadow-sm h-28 w-28'
														)}
													>
														<Image
															alt={String(attendee.user.name)}
															src={String(
																attendee?.user.image
																	? `https://cdn.evental.app${attendee?.user.image}`
																	: `https://cdn.evental.app/images/default-avatar.jpg`
															)}
															className="rounded-md"
															layout="fill"
														/>
													</div>
													<span className="text-center text-lg">{attendee.user.name}</span>
													<span className="block text-xs leading-none text-gray-700">
														{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
													</span>
												</a>
											</Link>
										</li>
									</Tooltip>
								)
					  )
					: Array.apply(null, Array(12)).map((_, i) => (
							<div className="flex h-full flex-col items-center justify-start" key={i}>
								<Skeleton className={classNames('mb-2 rounded-md h-28 w-28')} />
								<span className="block w-full text-center text-lg">
									<Skeleton className="w-full" />
								</span>
								<span className="block w-full text-xs leading-none text-gray-700">
									<Skeleton className="w-full" />
								</span>
							</div>
					  ))}
			</ul>
		</div>
	);
};
