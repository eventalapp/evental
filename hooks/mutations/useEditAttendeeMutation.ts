import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditAttendeePayload, EditAttendeeSchema } from '../../utils/schemas';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseEditAttendeeMutationData {
	editAttendeeMutation: UseMutationResult<
		AxiosResponse<Prisma.EventAttendee, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	editAttendeeError: ServerErrorPayload | null;
}

export const useEditAttendeeMutation = (eid: string, aid: string): UseEditAttendeeMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

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
				slug: parsed.slug,
				name: parsed.name,
				company: parsed.company,
				position: parsed.position,
				eventRoleId: parsed.eventRoleId
			};

			return await axios.put<Prisma.EventAttendee>(
				`/api/events/${eid}/admin/attendees/${aid}/edit`,
				body
			);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/attendees/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { editAttendeeMutation, editAttendeeError: error };
};
