import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeByUserIdQueryData {
	attendeeByUserId: EventAttendeeUser | undefined;
	isAttendeeByUserIdLoading: boolean;
	attendeeByUserIdError: ErroredAPIResponse | null;
}

export const useAttendeeByUserIdQuery = (
	eid: string,
	uid: string,
	initialData?: EventAttendeeUser | undefined
): UseAttendeeByUserIdQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendeeByUserId, isLoading: isAttendeeByUserIdLoading } = useQuery<
		EventAttendeeUser,
		AxiosError<ErroredAPIResponse>
	>(
		['attendeeByUserId', eid, uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<EventAttendeeUser>>(`/api/events/${eid}/attendees/user/${uid}`)
				.then((res) => res.data.data)
				.catch((err) => {
					return err.response.data;
				});
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && uid !== undefined && uid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { attendeeByUserId, isAttendeeByUserIdLoading, attendeeByUserIdError: error };
};
