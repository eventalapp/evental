import axios from 'axios';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees';

export const useAttendeeQuery = (eid: string, aid: string) => {
	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<EventMemberUser, Error>(
		['attendee', eid, aid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees/${aid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined' && aid !== undefined && aid !== 'undefined'
		}
	);

	return { attendee, isAttendeeLoading };
};
