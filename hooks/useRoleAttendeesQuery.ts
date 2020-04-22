import axios from 'axios';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees/[aid]';

export const useRoleAttendeesQuery = (eid: string, rid: string) => {
	const { data: roleAttendees, isLoading: isRoleAttendeesLoading } = useQuery<
		EventMemberUser[],
		Error
	>(
		['roleAttendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/roles/${rid}`).then((res) => res.data.attendees);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined'
		}
	);

	return { roleAttendees, isRoleAttendeesLoading };
};
