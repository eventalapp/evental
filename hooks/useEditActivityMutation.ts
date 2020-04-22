import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../typings/error';
import { getFormEntries } from '../utils/getFormEntries';
import { EditActivityPayload, EditActivitySchema } from '../utils/schemas';

export const useEditActivityMutation = (eid: string, aid: string) => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const editActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			let eventParsed = EditActivitySchema.parse(formEntries);

			const body: EditActivityPayload = {
				slug: eventParsed.slug,
				name: eventParsed.name,
				venueId: eventParsed.venueId,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			};

			return await axios.put<Prisma.EventActivity>(
				`/api/events/${eid}/admin/activities/${aid}/edit`,
				body
			);
		},
		{
			onSuccess: (response) => {
				queryClient.invalidateQueries(['activity', eid, aid]);

				router.push(`/events/${eid}/activities/${response.data.slug}`);
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { editActivityMutation, editActivityError: error };
};
