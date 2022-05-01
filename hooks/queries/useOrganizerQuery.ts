import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseOrganizerQueryData {
	isOrganizer: boolean | undefined;
	isOrganizerLoading: boolean;
	isOrganizerError: ErroredAPIResponse | null;
}

export const useOrganizerQuery = (eid: string, initialData?: boolean): UseOrganizerQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isOrganizer', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<boolean>>(`/api/events/${eid}/organizer`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { isOrganizer, isOrganizerLoading, isOrganizerError: error };
};
