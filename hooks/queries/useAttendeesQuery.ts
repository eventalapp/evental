import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedAttendeesWithUser } from '../../pages/api/events/[eid]/attendees';

export interface UseAttendeesQueryData {
	attendeesData: PaginatedAttendeesWithUser | undefined;
	isAttendeesLoading: boolean;
	attendeesError: ErroredAPIResponse | null;
}

export interface UseAttendeesQueryOptions {
	initialData?: PaginatedAttendeesWithUser | undefined;
	page?: number;
}

export const useAttendeesQuery = (
	eid: string,
	args: UseAttendeesQueryOptions = {}
): UseAttendeesQueryData => {
	const { initialData, page = 1 } = args;
	let params = new URLSearchParams();

	params.append('page', String(page));

	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendeesData, isLoading: isAttendeesLoading } = useQuery<
		PaginatedAttendeesWithUser,
		AxiosError<ErroredAPIResponse>
	>(
		['attendees', eid, page],
		async () => {
			return axios
				.get<SuccessAPIResponse<PaginatedAttendeesWithUser>>(
					`/api/events/${eid}/attendees?${params.toString()}`
				)
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
