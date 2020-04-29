import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseCreateVenueMutationData {
	createVenueMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	createVenueError: ServerErrorPayload | null;
}

export const useCreateVenueMutation = (eid: string): UseCreateVenueMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
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
				setError(null);

				toast.success('Venue created successfully');

				router.push(`/events/${eid}/venues/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { createVenueMutation, createVenueError: error };
};
