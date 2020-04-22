import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export const useActivityQuery = (eid: string, aid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: activityResponse, isLoading: isActivityLoading } = useQuery<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError>
	>(
		['activity', eid, aid],
		async () => {
			return await axios.get<Prisma.EventActivity>(`/api/events/${eid}/activities/${aid}`);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && aid !== undefined && aid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return {
		activity: activityResponse?.data,
		isActivityLoading,
		activityError: error
	};
};
