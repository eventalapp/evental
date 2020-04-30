import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';

export interface UseVenueQueryData {
	venue: Prisma.EventVenue | undefined;
	isVenueLoading: boolean;
	venueError: NextkitError | null;
}

export const useVenueQuery = (
	eid: string,
	vid: string,
	initialData?: Prisma.EventVenue | undefined
): UseVenueQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: venue, isLoading: isVenueLoading } = useQuery<
		Prisma.EventVenue,
		AxiosError<NextkitError>
	>(
		['venue', eid, vid],
		async () => {
			return axios
				.get<Prisma.EventVenue>(`/api/events/${eid}/venues/${vid}`)
				.then((res) => res.data);
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
