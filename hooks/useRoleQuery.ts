import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useRoleQuery = (eid: string, rid: string) => {
	const { data: role, isLoading: isRoleLoading } = useQuery<Prisma.EventRole, Error>(
		['role', eid, rid],
		async () => {
			return axios.get(`/api/events/${eid}/roles/${rid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined'
		}
	);

	return { role, isRoleLoading };
};
