import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

export interface UseIsOrganizerQueryData {
	isOrganizer: boolean | undefined;
	isOrganizerLoading: boolean;
}

export const useIsOrganizerQuery = (
	eid: string,
	initialData?: boolean
): UseIsOrganizerQueryData => {
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
