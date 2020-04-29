import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditEventPayload, EditEventSchema } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseEditEventMutationData {
	editEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useEditEventMutation = (eid: string): UseEditEventMutationData => {
	const queryClient = useQueryClient();

	const editEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditEventSchema.parse(formEntries);

			const body: EditEventPayload = {
				description: parsed.description,
				endDate: parsed.endDate,
				startDate: parsed.startDate,
				location: parsed.location,
				name: parsed.name
			};

			return await axios.put<Prisma.Event>(`/api/events/${eid}/admin/edit`, body);
		},
		{
			onSuccess: (response) => {
				toast.success('Event edited successfully');

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['event', eid]);
					void queryClient.invalidateQueries(['events', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { editEventMutation };
};
