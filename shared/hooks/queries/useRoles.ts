import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseRolesArgs {
	eid?: string;
}

export const useRoles = (args: UseRolesArgs = {}) => {
	const { eid } = args;

	return useQuery<Prisma.EventRole[], ErroredAPIResponse>(
		['roles', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.EventRole[]>>(`/events/${eid}/roles`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid)
		}
	);
};
