import type Prisma from '@prisma/client';
import axios from 'axios';
import { useQuery } from 'react-query';
import { EventMemberUser } from '../pages/api/events/[eid]/attendees/[aid]';

export const useRoleQuery = (eid: string, rid: string) => {
	const { data, isLoading: isRoleLoading } = useQuery<
		{ role: Prisma.EventRole; attendees: EventMemberUser[] },
		Error
	>(
		['role', eid, rid],
		async () => {
			return axios.get(`/api/events/${eid}/roles/${rid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined && eid !== 'undefined' && rid !== undefined && rid !== 'undefined'
		}
	);

	return { role: data?.role, attendees: data?.attendees, isRoleLoading };
};
