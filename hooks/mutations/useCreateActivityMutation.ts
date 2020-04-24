import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateActivityPayload, CreateActivitySchema } from '../../utils/schemas';

export interface UseCreateActivityMutationData {
	createActivityMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	createActivityError: ServerErrorPayload | null;
}

export const useCreateActivityMutation = (eid: string): UseCreateActivityMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const createActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			let parsed = CreateActivitySchema.parse(formEntries);

			const body: CreateActivityPayload = {
				slug: parsed.slug,
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: new Date(parsed.startDate).toISOString(),
				endDate: new Date(parsed.endDate).toISOString(),
				description: parsed.description
			};

			return await axios.post(`/api/events/${eid}/admin/activities/create`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/activities/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('activities');
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { createActivityMutation, createActivityError: error };
};
