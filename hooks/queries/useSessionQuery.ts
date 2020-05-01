import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseSessionQueryData {
	session: Prisma.EventSession | undefined;
	isSessionLoading: boolean;
	sessionError: ErroredAPIResponse | null;
}

export const useSessionQuery = (
	eid: string,
	sid: string,
	initialData?: Prisma.EventSession | undefined
): UseSessionQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: session, isLoading: isSessionLoading } = useQuery<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse>
	>(
		['session', eid, sid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventSession>>(`/api/events/${eid}/sessions/${sid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				sid !== undefined &&
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '',
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
		session,
		isSessionLoading,
		sessionError: error
	};
};
