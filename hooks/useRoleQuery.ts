import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees/[aid]';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useRoleQuery = (eid: string, rid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data, isLoading: isRoleLoading } = useQuery<
		{ role: Prisma.EventRole; attendees: EventMemberUser[] },
		AxiosError<ServerError>
	>(
		['role', eid, rid],
		async () => {
			return axios.get(`/api/events/${eid}/roles/${rid}`).then((res) => res.data);
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

	return { role: data?.role, attendees: data?.attendees, isRoleLoading, roleError: error };
};
