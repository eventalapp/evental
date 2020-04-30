import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateAttendeePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseCreateAttendeeMutationData {
	createAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateAttendeePayload
	>;
}

export const useCreateAttendeeMutation = (eid: string): UseCreateAttendeeMutationData => {
	const queryClient = useQueryClient();

	const createAttendeeMutation = useMutation<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateAttendeePayload
	>(
		async (data) => {
			return await axios.post<Prisma.EventAttendee>(`/api/events/${eid}/register`, data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully registered for this event.');

				router.push(`/events/${eid}/`).then(() => {
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
