import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useRolesQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: roles, isLoading: isRolesLoading } = useQuery<
		Prisma.EventRole[],
		AxiosError<ServerError>
	>(
		['roles', eid],
		async () => {
			return axios.get(`/api/events/${eid}/roles`).then((res) => res.data);
		},
		{
			retry: 1,
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
