import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export const useRoleAttendeesQuery = (eid: string, rid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: roleAttendees, isLoading: isRoleAttendeesLoading } = useQuery<
		EventMemberUser[],
		AxiosError<ServerError>
	>(
		['roleAttendees', eid],
		async () => {
			return axios.get(`/api/events/${eid}/roles/${rid}`).then((res) => res.data.attendees);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { roleAttendees, isRoleAttendeesLoading, roleError: error };
};
