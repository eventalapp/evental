import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse } from 'nextkit';
import { RoleAttendeePayload } from '../../pages/api/events/[eid]/roles/[rid]';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';
import Prisma from '@prisma/client';

export interface UseRoleAttendeesQueryData {
	attendees: EventAttendeeUser[] | undefined;
	role: Prisma.EventRole | undefined;
	isRoleAttendeesLoading: boolean;
	roleAttendeesError: ErroredAPIResponse | null;
}

export const useRoleAttendeesQuery = (
	eid: string,
	rid: string,
	initialData?: { attendees: EventAttendeeUser[] | undefined; role: Prisma.EventRole | undefined }
): UseRoleAttendeesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data, isLoading: isRoleAttendeesLoading } = useQuery<
		RoleAttendeePayload,
		AxiosError<ErroredAPIResponse>
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
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return {
		role: data?.role,
		attendees: data?.attendees,
		isRoleAttendeesLoading,
		roleAttendeesError: error
	};
};
