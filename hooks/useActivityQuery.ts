import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useActivityQuery = (eid: string, aid: string) => {
	const { data: activity, isLoading: isActivityLoading } = useQuery<Prisma.EventActivity, Error>(
		['activity', eid, aid],
		async () => {
			return axios.get(`/api/events/${eid}/activities/${aid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && aid !== undefined
		}
	);

	return { activity, isActivityLoading };
};
