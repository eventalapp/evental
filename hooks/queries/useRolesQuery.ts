import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseRolesQueryData {
	roles: Prisma.EventRole[] | undefined;
	isRolesLoading: boolean;
	rolesError: ServerErrorPayload | null;
}

export const useRolesQuery = (eid: string): UseRolesQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: roles, isLoading: isRolesLoading } = useQuery<
		Prisma.EventRole[],
		AxiosError<ServerError>
	>(
		['roles', eid],
		async () => {
			return axios.get<Prisma.EventRole[]>(`/api/events/${eid}/roles`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { roles, isRolesLoading, rolesError: error };
};
