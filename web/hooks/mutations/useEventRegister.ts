import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseeventRegistrationMutationData {
	eventRegistrationMutation: UseMutationResult<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

interface UseEventRegisterOptions {
	redirect?: boolean;
}

export const useEventRegister = (
	eid: string,
	args: UseEventRegisterOptions = {}
): UseeventRegistrationMutationData => {
	const { redirect = true } = args;

	const queryClient = useQueryClient();

	const eventRegistrationMutation = useMutation<
		Prisma.EventAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventAttendee>>(`/api/events/${eid}/register`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully registered for this event.');

				if (redirect) {
					router.push(`/events/${eid}`).then(() => {
						void queryClient.invalidateQueries(['attendees', eid]);
					});
				} else {
					void queryClient.invalidateQueries(['attendees', eid]);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { eventRegistrationMutation };
};
