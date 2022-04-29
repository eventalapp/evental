import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseActivityQueryData {
	activity: Prisma.EventActivity | undefined;
	isActivityLoading: boolean;
	activityError: ServerErrorPayload | null;
}

export const useActivityQuery = (
	eid: string,
	aid: string,
	initialData?: Prisma.EventActivity | undefined
): UseActivityQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: activity, isLoading: isActivityLoading } = useQuery<
		Prisma.EventActivity,
		AxiosError<ServerError>
	>(
		['activity', eid, aid],
		async () => {
			return await axios
				.get<Prisma.EventActivity>(`/api/events/${eid}/activities/${aid}`)
				.then((res) => res.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				aid !== undefined &&
				aid !== 'undefined' &&
				eid !== '' &&
				aid !== '',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return {
		activity,
		isActivityLoading,
		activityError: error
	};
};
