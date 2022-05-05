import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseFounderQueryData {
	isFounder: boolean | undefined;
	isFounderLoading: boolean;
}

export const useFounderQuery = (eid: string, initialData?: boolean): UseFounderQueryData => {
	const { data: isFounder, isLoading: isFounderLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isFounder', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<boolean>>(`/api/events/${eid}/founder`)
				.then((res) => res.data.data)
				.catch(() => {
					return false;
				});
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);

	return { isFounder, isFounderLoading };
};
