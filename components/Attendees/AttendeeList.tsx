import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { UseAttendeesQueryData } from '../../hooks/queries/useAttendeesQuery';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import { ServerError } from '../ServerError';

type Props = {
	eid: string;
} & UseAttendeesQueryData;

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, attendees, isAttendeesLoading, attendeesError } = props;

	if (isAttendeesLoading) {
		return <Loading />;
	}

	if (!attendees || attendees?.length === 0) {
		return <NotFound />;
	}

	if (attendeesError) {
		return <ServerError errors={[attendeesError]} />;
	}

	return (
		<div>
			<ul className="flex flex-row flex-wrap flex-start items-center">
				{attendees.map(
					(attendee) =>
						attendee &&
						attendee.user &&
						attendee.role && (
							<li key={attendee.id} className="w-32">
								<Link href={`/events/${eid}/attendees/${attendee.slug}`}>
									<a className="flex items-center justify-center flex-col">
										<div className="h-16 w-16 relative">
											<Image
												alt={String(attendee.name)}
												src={String(attendee.user.image)}
												className="rounded-full"
												layout="fill"
											/>
										</div>
										<span>{attendee.name}</span>
										<span className="block text-gray-700">
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
