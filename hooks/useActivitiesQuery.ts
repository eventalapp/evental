import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError } from '../typings/error';
import { ServerErrorPayload } from './../typings/error';

export const useActivitiesQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: activities, isLoading: isActivitiesLoading } = useQuery<
		Prisma.EventActivity[],
		AxiosError<ServerError>
	>(
		['activities', eid],
		async () => {
			return await axios.get(`/api/events/${eid}/activities`).then((res) => res.data);
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

	return { activities, isActivitiesLoading, activitiesError: error };
};
