import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseDeleteEventMutationData {
	deleteEventMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	deleteEventError: ServerErrorPayload | null;
}

export const useDeleteEventMutation = (eid: string): UseDeleteEventMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const deleteEventMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			return await axios.delete(`/api/events/${eid}/admin/delete`);
		},
		{
			onSuccess: () => {
				setError(null);

				router.push(`/events`).then(() => {
					void queryClient.invalidateQueries(['event', eid]);
					void queryClient.invalidateQueries(['events', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { deleteEventMutation, deleteEventError: error };
};
