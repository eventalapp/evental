import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseDeleteAttendeeMutationData {
	deleteAttendeeMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		void
	>;
}

export const useDeleteAttendeeMutation = (
	eid: string,
	aid: string
): UseDeleteAttendeeMutationData => {
	const queryClient = useQueryClient();

	const deleteAttendeeMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		void
	>(
		async () => {
			return await axios.delete(`/api/events/${eid}/admin/attendees/${aid}/delete`);
		},
		{
			onSuccess: () => {
				toast.success('Attendee deleted successfully');

				router.push(`/events/${eid}/attendees/`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, aid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { deleteAttendeeMutation };
};
