import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseAdminDeleteAttendeeMutationData {
	adminDeleteAttendeeMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useAdminDeleteAttendee = (
	eid: string,
	uid: string
): UseAdminDeleteAttendeeMutationData => {
	const queryClient = useQueryClient();

	const adminDeleteAttendeeMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/attendees/${uid}`)
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

	return { adminDeleteAttendeeMutation };
};
