import React from 'react';
import { AttendeeList } from '../attendees/AttendeeList';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';

type Props = {
	eid: string;
	rid: string;
} & UseRoleAttendeesQueryData;

export const RoleAttendeeList: React.FC<Props> = (props) => {
	const { eid, role, attendees } = props;

	if (!role || !attendees) return null;

	if (attendees?.length === 0) {
		return (
			<div>
				<p>No {role.name.toLowerCase()}s found.</p>
			</div>
		);
	}

	return (
		<div>
			<AttendeeList attendees={attendees} eid={eid} />
		</div>
	);
};
