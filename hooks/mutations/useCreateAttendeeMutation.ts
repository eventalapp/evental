import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateAttendeeMutationData {
	createAttendeeMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useCreateAttendeeMutation = (eid: string): UseCreateAttendeeMutationData => {
	const queryClient = useQueryClient();

	const createAttendeeMutation = useMutation<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventAttendee>>(`/api/events/${eid}/register`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully registered for this event.');

				router.push(`/events/${eid}/admin`).then(() => {
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createAttendeeMutation };
};
