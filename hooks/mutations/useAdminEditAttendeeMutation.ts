import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AdminEditAttendeePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseEditAttendeeMutationData {
	adminEditAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<NextkitError, unknown>,
		AdminEditAttendeePayload
	>;
}

export const useAdminEditAttendeeMutation = (
	eid: string,
	aid: string
): UseEditAttendeeMutationData => {
	const queryClient = useQueryClient();

	const adminEditAttendeeMutation = useMutation<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<NextkitError, unknown>,
		AdminEditAttendeePayload
	>(
		async (data) => {
			return await axios.put<Prisma.EventAttendee>(
				`/api/events/${eid}/admin/attendees/${aid}/edit`,
				data
			);
		},
		{
			onSuccess: (response) => {
				toast.success('Attendee edited successfully');

				router.push(`/events/${eid}/attendees/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.message ?? 'An error has occurred.');
			}
		}
	);

	return { adminEditAttendeeMutation };
};
