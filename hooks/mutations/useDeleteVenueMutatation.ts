import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseDeleteVenueMutationData {
	deleteVenueMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useDeleteVenueMutation = (eid: string, vid: string): UseDeleteVenueMutationData => {
	const queryClient = useQueryClient();

	const deleteVenueMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			return await axios.delete(`/api/events/${eid}/admin/venues/${vid}/delete`);
		},
		{
			onSuccess: () => {
				toast.success('Venue deleted successfully');

				router.push(`/events/${eid}/venues/`).then(() => {
					void queryClient.invalidateQueries(['venue', eid, vid]);
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { deleteVenueMutation };
};
