import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseVenueQueryData {
	venue: Prisma.EventVenue | undefined;
	isVenueLoading: boolean;
	venueError: ServerErrorPayload | null;
}

export const useVenueQuery = (eid: string, vid: string): UseVenueQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: venue, isLoading: isVenueLoading } = useQuery<
		Prisma.EventVenue,
		AxiosError<ServerError>
	>(
		['venue', eid, vid],
		async () => {
			return axios
				.get<Prisma.EventVenue>(`/api/events/${eid}/venues/${vid}`)
				.then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && vid !== undefined && vid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { venue, isVenueLoading, venueError: error };
};
