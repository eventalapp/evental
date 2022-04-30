import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseDeleteAttendeeMutationData {
	deleteAttendeeMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
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
		AxiosError<NextkitError, unknown>,
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
				toast.error(error.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteAttendeeMutation };
};
