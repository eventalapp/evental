import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseRoleArgs {
	eid?: string;
	rid?: string;
}

export const useRole = (args: UseRoleArgs = {}) => {
	const { eid, rid } = args;

	return useQuery<Prisma.EventRole, ErroredAPIResponse>(
		['role', eid, rid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.EventRole>>(`/events/${eid}/roles/${rid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(rid)
		}
	);
};
