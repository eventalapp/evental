import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AdminEditAttendeePayload } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';
import { populateFormData } from '../../utils/populateFormData';

export interface UseEditAttendeeMutationData {
	adminEditAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
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
		AxiosError<ServerError, unknown>,
		AdminEditAttendeePayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios.put<Prisma.EventAttendee>(
				`/api/events/${eid}/admin/attendees/${aid}/edit`,
				formData
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
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { adminEditAttendeeMutation };
};
