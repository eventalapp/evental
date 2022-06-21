import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { populateFormData } from '../../utils/populateFormData';
import { AdminCreateAttendeePayload } from '../../utils/schemas';

export interface UseAdminCreateAttendeeMutationData {
	adminCreateAttendeeMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminCreateAttendeePayload
	>;
}

export const useAdminCreateAttendeeMutation = (eid: string): UseAdminCreateAttendeeMutationData => {
	const queryClient = useQueryClient();

	const adminCreateAttendeeMutation = useMutation<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminCreateAttendeePayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.post<SuccessAPIResponse<Prisma.EventAttendee>>(
					`/api/events/${eid}/admin/attendees/create`,
					formData
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully created the users profile.');

				router.push(`/events/${eid}`).then(() => {
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { adminCreateAttendeeMutation };
};
