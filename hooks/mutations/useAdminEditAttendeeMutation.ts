import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AdminEditAttendeePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseEditAttendeeMutationData {
	adminEditAttendeeMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminEditAttendeePayload
	>;
}

export const useAdminEditAttendeeMutation = (
	eid: string,
	aid: string
): UseEditAttendeeMutationData => {
	const queryClient = useQueryClient();

	const adminEditAttendeeMutation = useMutation<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminEditAttendeePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventAttendee>>(
					`/api/events/${eid}/admin/attendees/${aid}/edit`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Attendee edited successfully');

				router.push(`/events/${eid}/attendees/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { adminEditAttendeeMutation };
};
