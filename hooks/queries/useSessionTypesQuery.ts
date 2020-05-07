import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import Prisma from '@prisma/client';

export interface UseSessionTypesQueryData {
	sessionTypes: Prisma.EventSessionType[] | undefined;
	isSessionTypesLoading: boolean;
	sessionTypesError: ErroredAPIResponse | null;
}

export const useSessionTypesQuery = (
	eid: string,
	initialData?: Prisma.EventSessionType[] | undefined
): UseSessionTypesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionTypes, isLoading: isSessionTypesLoading } = useQuery<
		Prisma.EventSessionType[],
		AxiosError<ErroredAPIResponse>
	>(
		['types', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventSessionType[]>>(`/api/events/${eid}/sessions/types`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && eid !== '',
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
		sessionTypes,
		isSessionTypesLoading,
		sessionTypesError: error
	};
};
