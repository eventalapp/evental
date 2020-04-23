import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditVenuePayload, EditVenueSchema } from '../../utils/schemas';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export const useEditVenueMutation = (eid: string, vid: string) => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const editVenueMutation = useMutation<
		AxiosResponse<Prisma.EventVenue, unknown>,
		AxiosError<ServerError>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditVenueSchema.parse(formEntries);

			const body: EditVenuePayload = {
				slug: parsed.slug,
				name: parsed.name,
				description: parsed.description
			};

			return await axios.put(`/api/events/${eid}/admin/venues/${vid}/edit`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/venues/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venue', eid, vid]);
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { editVenueMutation, editVenueError: error };
};
