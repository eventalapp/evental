import axios from 'axios';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees';

export const useAttendeesQuery = (eid: string) => {
	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
		{ organizers: EventMemberUser[]; attendees: EventMemberUser[] },
		Error
	>(
		['attendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined'
		}
	);

	return { attendees, isAttendeesLoading };
};
