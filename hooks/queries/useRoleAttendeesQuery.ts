import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { RoleAttendeePayload } from '../../pages/api/events/[eid]/roles/[rid]';
import Prisma from '@prisma/client';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

export interface UseRoleAttendeesQueryData {
	attendees: AttendeeWithUser[] | undefined;
	role: Prisma.EventRole | undefined;
	isRoleAttendeesLoading: boolean;
	roleAttendeesError: ErroredAPIResponse | null;
}

export const useRoleAttendeesQuery = (
	eid: string,
	rid: string,
	initialData?: { attendees: AttendeeWithUser[] | undefined; role: Prisma.EventRole | undefined }
): UseRoleAttendeesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data, isLoading: isRoleAttendeesLoading } = useQuery<
		RoleAttendeePayload,
		AxiosError<ErroredAPIResponse>
	>(
		['role', eid, rid],
		async () => {
			return axios
				.get<SuccessAPIResponse<RoleAttendeePayload>>(`/api/events/${eid}/roles/${rid}`)
				.then((res) => res.data.data);
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
