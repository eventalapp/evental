import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/stripUserPassword';

export interface UseAttendeesQueryData {
	attendeesData: AttendeeWithUser[] | undefined;
	isAttendeesLoading: boolean;
	attendeesError: ErroredAPIResponse | null;
}

export interface UseAttendeesQueryOptions {
	initialData?: AttendeeWithUser[] | undefined;
}

export const useAttendeesQuery = (
	eid: string,
	args: UseAttendeesQueryOptions = {}
): UseAttendeesQueryData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendeesData, isLoading: isAttendeesLoading } = useQuery<
		AttendeeWithUser[],
		AxiosError<ErroredAPIResponse>
	>(
		['attendees', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(`/api/events/${eid}/attendees`)
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

	return { attendeesData, isAttendeesLoading, attendeesError: error };
};
