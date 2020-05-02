import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseOrganizerQueryData {
	isOrganizer: boolean | undefined;
	isOrganizerLoading: boolean;
}

export const useOrganizerQuery = (eid: string, initialData?: boolean): UseOrganizerQueryData => {
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isOrganizer', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<boolean>>(`/api/events/${eid}/organizer`)
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

	return { isOrganizer, isOrganizerLoading };
};
