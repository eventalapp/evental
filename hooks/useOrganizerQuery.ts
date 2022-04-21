import axios from 'axios';
import { useQuery } from 'react-query';

export const useOrganizerQuery = (eid: string) => {
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<boolean, Error>(
		['isOrganizer', eid],
		async () => {
			return axios.get(`/api/events/${eid}/organizer`).then((res) => res.data.isOrganizer);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined'
		}
	);

	return { isOrganizer, isOrganizerLoading };
};
