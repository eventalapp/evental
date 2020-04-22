import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateEventPayload, CreateEventSchema } from '../../utils/schemas';

export const useCreateEventMutation = () => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const createEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const eventParsed = CreateEventSchema.parse(formEntries);

			const body: CreateEventPayload = {
				name: eventParsed.name,
				slug: eventParsed.slug,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			};

			return await axios.post('/api/events/create', body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				void queryClient.invalidateQueries(['events']);

				void router.push(`/events/${response.data.slug}`);
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { createEventMutation, createEventError: error };
};
