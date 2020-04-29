import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError } from '../../typings/error';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseCreateVenueMutationData {
	createVenueMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useCreateVenueMutation = (eid: string): UseCreateVenueMutationData => {
	const queryClient = useQueryClient();

	const createVenueMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = CreateVenueSchema.parse(formEntries);

			const body: CreateVenuePayload = {
				name: parsed.name,
				slug: processSlug(parsed.slug),
				description: parsed.description
			};

			return await axios.post<Prisma.EventActivity>(`/api/events/${eid}/admin/venues/create`, body);
		},
		{
			onSuccess: (response) => {
				toast.success('Venue created successfully');

				router.push(`/events/${eid}/venues/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { createVenueMutation };
};
