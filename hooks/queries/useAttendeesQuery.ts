import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import { NextkitError } from 'nextkit';

export interface UseAttendeesQueryData {
	attendees: EventAttendeeUser[] | undefined;
	isAttendeesLoading: boolean;
	attendeesError: NextkitError | null;
}

export const useAttendeesQuery = (
	eid: string,
	initialData?: EventAttendeeUser[] | undefined
): UseAttendeesQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: attendees, isLoading: isAttendeesLoading } = useQuery<
		EventAttendeeUser[],
		AxiosError<NextkitError>
	>(
		['attendees', eid],
		async () => {
			return axios.get<EventAttendeeUser[]>(`/api/events/${eid}/attendees`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { attendees, isAttendeesLoading, attendeesError: error };
};
