import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { AttendeeWithUser, capitalizeFirstLetter } from '@eventalapp/shared/utils';
import { faBadgeCheck } from '@eventalapp/shared/utils/icons';

import { NotFound } from '../error/NotFound';
import { AspectImage } from '../guides/AspectImage';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	attendees?: AttendeeWithUser[];
	admin?: boolean;
};

export const attendeeListSkeleton = Array.apply(null, Array(12)).map((_, i) => (
	<div className="flex h-full flex-col items-center justify-start" key={i}>
		<Skeleton className={classNames('mb-2 h-28 w-28 rounded-md')} />
		<span className="block w-full text-center text-lg">
			<Skeleton className="w-full" />
		</span>
		<span className="block w-full text-xs leading-none text-gray-700">
			<Skeleton className="w-full" />
		</span>
	</div>
));

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
										<li className="relative">
											{admin && attendee.user.claimedAt && (
												<Tooltip message="This user has claimed their account, you cannot update their user settings (Such as image, description, website, etc.)">
													<div className="absolute -top-1.5 -left-1.5 z-10 inline-block">
														<div className="relative">
															<div className="absolute top-0 h-4 w-4 rounded-full bg-white" />
															<FontAwesomeIcon
																fill="currentColor"
																className="relative h-5 w-5 text-green-400"
																icon={faBadgeCheck}
															/>
														</div>
													</div>
												</Tooltip>
											)}
											<Link
												href={`/events/${eid}${admin ? '/admin' : ''}/attendees/${
													attendee.user.slug
												}`}
											>
												<a className="flex h-full flex-col items-center justify-start">
													<div className={classNames('relative mb-2 w-full')}>
														<AspectImage
															ratio={1}
															alt={String(attendee.user.name)}
															imageUrl={String(
																attendee?.user.image
																	? `https://cdn.evental.app${attendee?.user.image}`
																	: `https://cdn.evental.app/images/default-avatar.jpg`
															)}
															className="border border-gray-200 shadow-sm"
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
					: attendeeListSkeleton}
			</ul>
		</div>
	);
};
