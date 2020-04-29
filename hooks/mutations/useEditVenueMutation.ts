import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditVenuePayload, EditVenueSchema } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseEditVenueMutationData {
	editVenueMutation: UseMutationResult<
		AxiosResponse<Prisma.EventVenue, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useEditVenueMutation = (eid: string, vid: string): UseEditVenueMutationData => {
	const queryClient = useQueryClient();

	const editVenueMutation = useMutation<
		AxiosResponse<Prisma.EventVenue, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditVenueSchema.parse(formEntries);

			const body: EditVenuePayload = {
				slug: processSlug(parsed.slug),
				name: parsed.name,
				description: parsed.description
			};

			return await axios.put<Prisma.EventVenue>(
				`/api/events/${eid}/admin/venues/${vid}/edit`,
				body
			);
		},
		{
			onSuccess: (response) => {
				toast.success('Venue edited successfully');

				router.push(`/events/${eid}/venues/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venue', eid, vid]);
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { editVenueMutation };
};
