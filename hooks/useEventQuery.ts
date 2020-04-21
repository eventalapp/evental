import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useEventQuery = (eid: string) => {
	const { data: event, isLoading: isEventLoading } = useQuery<Prisma.Event, Error>(
		['event', eid],
		async () => {
			return axios.get(`/api/events/${eid}`).then((res) => res.data.event);
		},
		{
			enabled: eid !== undefined
		}
	);

	return { event, isEventLoading };
};
