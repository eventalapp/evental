import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseDeleteAttendeeMutationData {
	deleteAttendeeMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteAttendeeMutation = (
	eid: string,
	uid: string
): UseDeleteAttendeeMutationData => {
	const queryClient = useQueryClient();

	const deleteAttendeeMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/attendees/${uid}/delete`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Attendee deleted successfully');

				router.push(`/events/${eid}/admin/attendees/`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, uid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteAttendeeMutation };
};