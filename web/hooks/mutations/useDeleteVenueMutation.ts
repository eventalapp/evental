import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseDeleteVenueMutationData {
	deleteVenueMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteVenueMutation = (eid: string, vid: string): UseDeleteVenueMutationData => {
	const queryClient = useQueryClient();

	const deleteVenueMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/venues/${vid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Venue deleted successfully');

				router.push(`/events/${eid}/admin/venues/`).then(() => {
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
