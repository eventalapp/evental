import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';

export const useCreateVenueMutation = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const createVenueMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const eventParsed = CreateRoleSchema.parse(formEntries);

			const body: CreateRolePayload = {
				name: eventParsed.name,
				slug: eventParsed.slug
			};

			return await axios.post(`/api/events/${eid}/admin/roles/create`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				void queryClient.invalidateQueries(['venues', eid]);

				void router.push(`/events/${eid}/roles/${response.data.slug}`);
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { createVenueMutation, createVenueError: error };
};
