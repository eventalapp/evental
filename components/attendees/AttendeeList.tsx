import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
	attendees: AttendeeWithUser[];
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
				{attendees &&
					attendees.map(
						(attendee) =>
							attendee &&
							attendee.user &&
							attendee.role && (
								<li key={attendee.id}>
									<Link
										href={`/events/${eid}${admin ? '/admin' : ''}/attendees/${attendee.user.slug}`}
									>
										<a className="flex h-full flex-col items-center justify-start">
											<div className="relative mb-1 h-28 w-28 rounded-full border-2 border-gray-100">
												<Image
													alt={String(attendee.user.name)}
													src={String(
														attendee?.user.image
															? `https://cdn.evental.app${attendee?.user.image}`
															: `https://cdn.evental.app/images/default-avatar.jpg`
													)}
													className="rounded-full"
													layout="fill"
												/>
											</div>
											<span className="text-center text-lg">{attendee.user.name}</span>
											<span className="block text-sm leading-none text-gray-700">
												{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
											</span>
										</a>
									</Link>
								</li>
							)
					)}
			</ul>
		</div>
	);
};
