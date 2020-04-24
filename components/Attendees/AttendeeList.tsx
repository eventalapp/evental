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
			<div>
				<ul>
					{attendees.map(
						(attendee) =>
							attendee &&
							attendee.user &&
							attendee.role && (
								<li key={attendee.id}>
									<Link href={`/events/${eid}/attendees/${attendee.slug}`}>
										<a>
											<div className="h-16 w-16 relative">
												<Image
													alt={String(attendee.user.name)}
													src={String(attendee.user.image)}
													className="rounded-full"
													layout="fill"
												/>
											</div>
											<span>{attendee.user.name}</span>
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
		</div>
	);
};
