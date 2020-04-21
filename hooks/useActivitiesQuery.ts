import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useActivitiesQuery = (eid: string) => {
	const { data: activities, isLoading: isActivitiesLoading } = useQuery<
		Prisma.EventActivity[],
		Error
	>(
		['activities', eid],
		async () => {
			return axios.get(`/api/events/${eid}/activities`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return { activities, isActivitiesLoading };
};
