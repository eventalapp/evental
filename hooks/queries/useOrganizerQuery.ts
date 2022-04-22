import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export const useOrganizerQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<
		boolean,
		AxiosError<ServerError>
	>(
		['isOrganizer', eid],
		async () => {
			return axios.get(`/api/events/${eid}/organizer`).then((res) => res.data.isOrganizer);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { isOrganizer, isOrganizerLoading, isOrganizerError: error };
};
