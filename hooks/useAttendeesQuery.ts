import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees/[aid]';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useAttendeesQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
		{ organizers: EventMemberUser[]; attendees: EventMemberUser[] },
		AxiosError<ServerError>
	>(
		['attendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/attendees`).then((res) => res.data);
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
