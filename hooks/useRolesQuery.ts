import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useRolesQuery = (eid: string) => {
	const { data: roles, isLoading: isRolesLoading } = useQuery<Prisma.EventRole[], Error>(
		['roles', eid],
		async () => {
			return axios.get(`/api/events/${eid}/roles`).then((res) => res.data.roles);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined'
		}
	);

	return { roles, isRolesLoading };
};
