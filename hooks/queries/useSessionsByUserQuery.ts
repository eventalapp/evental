import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenueEvent } from '../../pages/api/users/[uid]/sessions';

export interface UseSessionsByUserData {
	sessionsByUserData: SessionWithVenueEvent[] | undefined;
	isSessionsByUserLoading: boolean;
}

export interface UseSessionsByUserOptions {
	initialData?: SessionWithVenueEvent[] | undefined;
}

export const useSessionsByUserQuery = (
	uid: string,
	args: UseSessionsByUserOptions = {}
): UseSessionsByUserData => {
	const { initialData } = args;

	let params = new URLSearchParams();

	params.append('user', String(uid));

	const { data: sessionsByUserData, isLoading: isSessionsByUserLoading } = useQuery<
		SessionWithVenueEvent[],
		AxiosError<ErroredAPIResponse>
	>(
		['user-sessions', uid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenueEvent[]>>(`/api/users/${uid}/sessions?${params}`)
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
