import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedSessionsWithVenueEvent } from '../../pages/api/users/[uid]/sessions';

export interface UseSessionsByUserData {
	sessionsByUserData: PaginatedSessionsWithVenueEvent | undefined;
	isSessionsByUserLoading: boolean;
}

export interface UseSessionsByUserOptions {
	initialData?: PaginatedSessionsWithVenueEvent | undefined;
	page?: number;
}

export const useSessionsByUserQuery = (
	uid: string,
	args: UseSessionsByUserOptions = {}
): UseSessionsByUserData => {
	const { initialData, page = 1 } = args;

	let params = new URLSearchParams();

	params.append('page', String(page));
	params.append('user', String(uid));

	const { data: sessionsByUserData, isLoading: isSessionsByUserLoading } = useQuery<
		PaginatedSessionsWithVenueEvent,
		AxiosError<ErroredAPIResponse>
	>(
		['user-sessions', uid, page],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PaginatedSessionsWithVenueEvent>>(
					`/api/users/${uid}/sessions?${params}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: uid !== undefined && uid !== 'undefined',
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByUserData, isSessionsByUserLoading };
};
