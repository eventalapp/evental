import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';

export interface UseOrganizerQueryData {
	isOrganizer: boolean | undefined;
	isOrganizerLoading: boolean;
	isOrganizerError: NextkitError | null;
}

export const useOrganizerQuery = (eid: string, initialData?: boolean): UseOrganizerQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<
		boolean,
		AxiosError<NextkitError>
	>(
		['isOrganizer', eid],
		async () => {
			return axios.get<boolean>(`/api/events/${eid}/organizer`).then((res) => res.data);
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
