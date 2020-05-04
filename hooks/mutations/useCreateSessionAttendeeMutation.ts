import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateSessionAttendeeMutationData {
	createSessionAttendeeMutation: UseMutationResult<
		Prisma.EventSessionAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useCreateSessionAttendeeMutation = (
	eid: string,
	sid: string
): UseCreateSessionAttendeeMutationData => {
	const queryClient = useQueryClient();

	const createSessionAttendeeMutation = useMutation<
		Prisma.EventSessionAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventSessionAttendee>>(
					`/api/events/${eid}/sessions/${sid}/register`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully registered for this event.');

				router.push(`/events/${eid}/admin/sessions/${sid}`).then(() => {
					void queryClient.invalidateQueries(['attendees', eid, sid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionAttendeeMutation };
};
