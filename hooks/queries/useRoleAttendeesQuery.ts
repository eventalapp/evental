import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { RoleAttendeePayload } from '../../pages/api/events/[eid]/roles/[rid]';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import Prisma from '@prisma/client';

export interface UseRoleAttendeesQueryData {
	attendees: EventAttendeeUser[] | undefined;
	role: Prisma.EventRole | undefined;
	isRoleAttendeesLoading: boolean;
	roleAttendeesError: ServerErrorPayload | null;
}

export const useRoleAttendeesQuery = (eid: string, rid: string): UseRoleAttendeesQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data, isLoading: isRoleAttendeesLoading } = useQuery<
		RoleAttendeePayload,
		AxiosError<ServerError>
	>(
		['role', eid, rid],
		async () => {
			return axios
				.get<RoleAttendeePayload>(`/api/events/${eid}/roles/${rid}`)
				.then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return {
		role: data?.role,
		attendees: data?.attendees,
		isRoleAttendeesLoading,
		roleAttendeesError: error
	};
};
