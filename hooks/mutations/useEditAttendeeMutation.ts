import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditAttendeePayload, EditAttendeeSchema } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseEditAttendeeMutationData {
	editAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useEditAttendeeMutation = (eid: string, aid: string): UseEditAttendeeMutationData => {
	const queryClient = useQueryClient();

	const editAttendeeMutation = useMutation<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditAttendeeSchema.parse(formEntries);

			const body: EditAttendeePayload = {
				slug: processSlug(parsed.slug),
				name: parsed.name,
				company: parsed.company,
				position: parsed.position,
				eventRoleId: parsed.eventRoleId,
				image: parsed.image,
				description: parsed.description,
				location: parsed.location
			};

			return await axios.put<Prisma.EventAttendee>(
				`/api/events/${eid}/admin/attendees/${aid}/edit`,
				body
			);
		},
		{
			onSuccess: (response) => {
				toast.success('Attendee edited successfully');

				router.push(`/events/${eid}/attendees/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { editAttendeeMutation };
};
