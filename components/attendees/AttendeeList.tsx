import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { NotFound } from '../error/NotFound';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

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
			<ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
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
										<a className="flex items-center justify-between flex-col h-full">
											<div className="h-16 w-16 relative mb-1 border-2 border-gray-100 rounded-full">
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
											<span className="text-lg text-center">{attendee.user.name}</span>
											<span className="block text-gray-700 text-sm leading-none">
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
