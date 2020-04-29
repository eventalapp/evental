import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseDeleteEventMutationData {
	deleteEventMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useDeleteEventMutation = (eid: string): UseDeleteEventMutationData => {
	const queryClient = useQueryClient();

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
				toast.success('Event deleted successfully');

				router.push(`/events`).then(() => {
					void queryClient.invalidateQueries(['event', eid]);
					void queryClient.invalidateQueries(['events', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { deleteEventMutation };
};
