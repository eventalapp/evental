import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse } from 'nextkit';

export interface UseDeleteVenueMutationData {
	deleteVenueMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useDeleteVenueMutation = (eid: string, vid: string): UseDeleteVenueMutationData => {
	const queryClient = useQueryClient();

	const deleteVenueMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async () => {
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
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteVenueMutation };
};
