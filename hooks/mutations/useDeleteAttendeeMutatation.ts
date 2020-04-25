import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseDeleteAttendeeMutationData {
	deleteAttendeeMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	deleteAttendeeError: ServerErrorPayload | null;
}

export const useDeleteAttendeeMutation = (
	eid: string,
	aid: string
): UseDeleteAttendeeMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const deleteAttendeeMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			return await axios.delete(`/api/events/${eid}/admin/attendees/${aid}/delete`);
		},
		{
			onSuccess: () => {
				setError(null);

				router.push(`/events/${eid}/attendees/`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { deleteAttendeeMutation, deleteAttendeeError: error };
};
