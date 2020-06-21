import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseSessionTypeQueryData {
	sessionType: Prisma.EventSessionType | undefined;
	isSessionTypeLoading: boolean;
	sessionTypeError: ErroredAPIResponse | null;
}

export const useSessionTypeQuery = (
	eid: string,
	tid: string,
	initialData?: Prisma.EventSessionType | undefined
): UseSessionTypeQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionType, isLoading: isSessionTypeLoading } = useQuery<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse>
	>(
		['type', eid, tid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventSessionType>>(
					`/api/events/${eid}/sessions/types/${tid}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				tid !== undefined &&
				tid !== 'undefined' &&
				eid !== '' &&
				tid !== '',
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
		sessionType,
		isSessionTypeLoading,
		sessionTypeError: error
	};
};
