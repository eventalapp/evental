import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseAttendeesQueryData {
	attendees: EventMemberUser[] | undefined;
	isAttendeesLoading: boolean;
	attendeesError: ServerErrorPayload | null;
}

export const useAttendeesQuery = (eid: string): UseAttendeesQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
		EventMemberUser[],
		AxiosError<ServerError>
	>(
		['attendees', eid],
		async () => {
			return axios.get<EventMemberUser[]>(`/api/events/${eid}/attendees`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { attendees, isAttendeesLoading, attendeesError: error };
};
