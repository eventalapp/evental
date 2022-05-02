import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

export interface UseAttendeesQueryData {
	attendees: AttendeeWithUser[] | undefined;
	isAttendeesLoading: boolean;
	attendeesError: ErroredAPIResponse | null;
}

export const useAttendeesQuery = (
	eid: string,
	initialData?: AttendeeWithUser[] | undefined
): UseAttendeesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
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

	return { attendees, isAttendeesLoading, attendeesError: error };
};
