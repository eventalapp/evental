import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeByUserIdQueryData {
	attendeeByUserId: EventAttendeeUser | undefined;
	isAttendeeByUserIdLoading: boolean;
	attendeeByUserIdError: ServerErrorPayload | null;
}

export const useAttendeeByUserIdQuery = (
	eid: string,
	uid: string,
	initialData?: EventAttendeeUser | undefined
): UseAttendeeByUserIdQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendeeByUserId, isLoading: isAttendeeByUserIdLoading } = useQuery<
		EventAttendeeUser,
		AxiosError<ServerError>
	>(
		['attendeeByUserId', eid, uid],
		async () => {
			return axios
				.get<EventAttendeeUser>(`/api/events/${eid}/attendees/user/${uid}`)
				.then((res) => res.data)
				.catch((err) => {
					return err.response.data;
				});
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && uid !== undefined && uid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { attendeeByUserId, isAttendeeByUserIdLoading, attendeeByUserIdError: error };
};
