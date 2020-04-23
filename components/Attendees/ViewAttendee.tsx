import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';

interface Props {
	loading: boolean;
	attendee: EventMemberUser | undefined;
}

export const ViewAttendee: React.FC<Props> = (props) => {
	const { loading, attendee } = props;

	if (loading) {
		return (
			<div>
				<p>Activities loading...</p>
			</div>
		);
	}

	if (!attendee || !attendee.user) {
		return (
			<div>
				<p>Attendee not found.</p>
			</div>
		);
	}

	return (
		<div>
			{attendee && attendee.user && attendee.role && (
				<div>
					<div className="h-32 w-32 relative">
						<Image
							alt={String(attendee.user.name)}
							src={String(attendee.user.image)}
							className="rounded-full"
							layout="fill"
						/>
					</div>
					<h1 className="text-3xl">{attendee.user.name}</h1>
					<p>{capitalizeFirstLetter(String(attendee.permissionRole).toLowerCase())}</p>
					<p>{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}</p>
					<span className="text-md text-gray-700 block">{attendee.user.company}</span>
					<span className="text-md text-gray-700 block">{attendee.user.position}</span>
				</div>
			)}
		</div>
	);
};
