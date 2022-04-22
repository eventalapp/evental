import axios from 'axios';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees';

export const useRoleAttendeesQuery = (eid: string, rid: string) => {
	const { data: roleAttendees, isLoading: isRoleAttendeesLoading } = useQuery<
		EventMemberUser[],
		Error
	>(
		['roleAttendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees/${rid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined'
		}
	);

	return { roleAttendees, isRoleAttendeesLoading };
};
