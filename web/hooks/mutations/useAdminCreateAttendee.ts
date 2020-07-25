import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { AdminCreateAttendeePayload } from '@eventalapp/shared/utils';

import { populateFormData } from '../../utils/form';

export interface UseAdminCreateAttendeeMutationData {
	adminCreateAttendeeMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		AdminCreateAttendeePayload
	>;
}

interface UseAdminCreateAttendeeMutationOptions {
	redirectUrl?: string;
	redirect?: boolean;
}

export const useAdminCreateAttendee = (
	eid: string,
	args: UseAdminCreateAttendeeMutationOptions = {}
): UseAdminCreateAttendeeMutationData => {
	const { redirectUrl = `/events/${eid}/admin/attendees`, redirect = true } = args;

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

				if (redirect) {
					router.push(redirectUrl).then(() => {
						void queryClient.invalidateQueries(['attendees', eid]);
						void queryClient.invalidateQueries(['attendees-by-name', eid, '']);
					});
				} else {
					void queryClient.invalidateQueries(['attendees', eid]);
					void queryClient.invalidateQueries(['attendees-by-name', eid, '']);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { adminCreateAttendeeMutation };
};
