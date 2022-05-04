import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseDeleteSessionMutationData {
	deleteSessionMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteSessionMutation = (
	eid: string,
	sid: string
): UseDeleteSessionMutationData => {
	const queryClient = useQueryClient();

	const deleteSessionMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/sessions/${sid}/delete`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session deleted successfully');

				router.push(`/events/${eid}/admin/sessions/`).then(() => {
					void queryClient.invalidateQueries(['session', eid, sid]);
					void queryClient.invalidateQueries(['sessions', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteSessionMutation };
};
