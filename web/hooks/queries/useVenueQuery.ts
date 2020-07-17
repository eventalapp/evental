import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseVenueQueryData {
	venue: Prisma.EventVenue | undefined;
	isVenueLoading: boolean;
	venueError: ErroredAPIResponse | null;
}

export const useVenueQuery = (
	eid: string,
	vid: string,
	initialData?: Prisma.EventVenue | undefined
): UseVenueQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: venue, isLoading: isVenueLoading } = useQuery<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['venue', eid, vid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.EventVenue>>(`/api/events/${eid}/venues/${vid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				vid !== undefined &&
				vid !== 'undefined' &&
				vid !== '' &&
				eid !== '',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { venue, isVenueLoading, venueError: error };
};
