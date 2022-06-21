import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseRoleQueryData {
	role: Prisma.EventRole | undefined;
	isRoleLoading: boolean;
	roleError: ErroredAPIResponse | null;
}

export const useRoleQuery = (
	eid: string,
	rid: string,
	initialData?: Prisma.EventRole | undefined
): UseRoleQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: role, isLoading: isRoleLoading } = useQuery<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse>
	>(
		['role', eid, rid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.EventRole>>(`/api/events/${eid}/roles/${rid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return {
		role,
		isRoleLoading,
		roleError: error
	};
};
