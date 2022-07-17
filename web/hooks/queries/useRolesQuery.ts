import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseRolesQueryData {
	roles: Prisma.EventRole[] | undefined;
	isRolesLoading: boolean;
	rolesError: ErroredAPIResponse | null;
}

export const useRolesQuery = (eid: string, initialData?: Prisma.EventRole[]): UseRolesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: roles, isLoading: isRolesLoading } = useQuery<
		Prisma.EventRole[],
		AxiosError<ErroredAPIResponse>
	>(
		['roles', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.EventRole[]>>(`/api/events/${eid}/roles`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { roles, isRolesLoading, rolesError: error };
};
