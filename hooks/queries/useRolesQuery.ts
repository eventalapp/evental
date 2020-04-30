import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';

export interface UseRolesQueryData {
	roles: Prisma.EventRole[] | undefined;
	isRolesLoading: boolean;
	rolesError: NextkitError | null;
}

export const useRolesQuery = (eid: string, initialData?: Prisma.EventRole[]): UseRolesQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: roles, isLoading: isRolesLoading } = useQuery<
		Prisma.EventRole[],
		AxiosError<NextkitError>
	>(
		['roles', eid],
		async () => {
			return axios.get<Prisma.EventRole[]>(`/api/events/${eid}/roles`).then((res) => res.data);
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
