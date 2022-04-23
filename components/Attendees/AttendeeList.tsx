import Image from 'next/image';
import Link from 'next/link';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import React from 'react';

interface Props {
	loading: boolean;
	attendees: EventMemberUser[] | undefined;
	eid: string;
}

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, loading, attendees } = props;

	if (loading) {
		return (
			<div>
				<p>Attendees loading...</p>
			</div>
		);
	}

	if (attendees?.length === 0) {
		return (
			<div>
				<p>No attendees found.</p>
			</div>
		);
	}

	return (
		<div>
			{attendees && (
				<div>
					<ul>
						{attendees.map(
							(attendee) =>
								attendee &&
								attendee.user && (
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
											</a>
										</Link>
									</li>
								)
						)}
					</ul>
				</div>
			)}
		</div>
	);
};
