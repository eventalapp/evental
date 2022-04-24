import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';

type Props = UseAttendeeQueryData;

export const ViewAttendee: React.FC<Props> = (props) => {
	const { attendee, isAttendeeLoading, attendeeError } = props;

	if (isAttendeeLoading) {
		return <Loading />;
	}

	if (attendeeError) {
		return <ServerError errors={[attendeeError]} />;
	}

	if (!attendee || !attendee.user || !attendee.role) {
		return <NotFound />;
	}

	return (
		<div>
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
		</div>
	);
};
