import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseAttendeesQueryData {
	attendees: EventAttendeeUser[] | undefined;
	isAttendeesLoading: boolean;
	attendeesError: ServerErrorPayload | null;
}

export const useAttendeesQuery = (eid: string): UseAttendeesQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
		EventAttendeeUser[],
		AxiosError<ServerError>
	>(
		['attendees', eid],
		async () => {
			return axios.get<EventAttendeeUser[]>(`/api/events/${eid}/attendees`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { attendees, isAttendeesLoading, attendeesError: error };
};
