import type Prisma from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { capitalizeFirstLetter } from '../../utils/string';

interface Props {
	loading: boolean;
	attendees: EventMemberUser[] | undefined;
	eid: string;
	role: Prisma.EventRole | undefined;
}

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, loading, attendees, role } = props;

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
				{role && (
					<>
						<h2 className="text-2xl my-3">
							{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
						</h2>
						<p>No {role.name.toLowerCase()}s found.</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div>
			{attendees && role && (
				<div>
					<h2 className="text-2xl my-3">
						{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
					</h2>
					<ul>
						{attendees.map((attendee) => (
							<li key={attendee.id}>
								<Link href={`/events/${eid}/attendees/${attendee.userId}`}>
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
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
