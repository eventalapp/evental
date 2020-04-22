import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useEventsQuery = () => {
	const { data: events, isLoading: isEventsLoading } = useQuery<Prisma.Event[], Error>(
		['events'],
		async () => {
			return axios.get(`/api/events`).then((res) => res.data);
		}
	);

	return { events, isEventsLoading };
};
