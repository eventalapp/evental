import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useVenuesQuery = (eid: string) => {
	const { data: venues, isLoading: isVenuesLoading } = useQuery<Prisma.EventVenue[], Error>(
		['venues', eid],
		async () => {
			return axios.get(`/api/events/${eid}/venues`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return { venues, isVenuesLoading };
};
