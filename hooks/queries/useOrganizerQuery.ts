import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseOrganizerQueryData {
	isOrganizer: boolean | undefined;
	isOrganizerLoading: boolean;
	isOrganizerError: ServerErrorPayload | null;
}

export const useOrganizerQuery = (eid: string, initialData?: boolean): UseOrganizerQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<
		boolean,
		AxiosError<ServerError>
	>(
		['isOrganizer', eid],
		async () => {
			return axios.get<boolean>(`/api/events/${eid}/organizer`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { isOrganizer, isOrganizerLoading, isOrganizerError: error };
};
