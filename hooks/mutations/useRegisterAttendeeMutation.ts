import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateAttendeePayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';

export interface UseRegisterAttendeeMutationData {
	registerAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
		CreateAttendeePayload
	>;
	registerAttendeeError: ServerErrorPayload | null;
}

export const useRegisterAttendeeMutation = (eid: string): UseRegisterAttendeeMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const registerAttendeeMutation = useMutation<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
		CreateAttendeePayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios.post<Prisma.EventAttendee>(`/api/events/${eid}/register`, formData);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/attendees/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { registerAttendeeMutation, registerAttendeeError: error };
};
