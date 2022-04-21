import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useVenueQuery = (eid: string, vid: string) => {
	const { data: venue, isLoading: isVenueLoading } = useQuery<Prisma.EventVenue, Error>(
		['venue', eid, vid],
		async () => {
			return axios.get(`/api/events/${eid}/venues/${vid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && vid !== undefined
		}
	);

	return { venue, isVenueLoading };
};
