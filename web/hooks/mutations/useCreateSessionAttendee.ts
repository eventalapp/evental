import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseCreateSessionAttendeeMutationData {
	createSessionAttendeeMutation: UseMutationResult<
		Prisma.EventSessionAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

interface UseCreateSessionAttendeeOptions {
	redirectUrl?: string;
}

export const useCreateSessionAttendee = (
	eid: string,
	sid: string,
	userId: string | undefined,
	args: UseCreateSessionAttendeeOptions = {}
): UseCreateSessionAttendeeMutationData => {
	const { redirectUrl } = args;

	const queryClient = useQueryClient();

	const createSessionAttendeeMutation = useMutation<
		Prisma.EventSessionAttendee,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventSessionAttendee>>(
					`/api/events/${eid}/sessions/${sid}/register`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully registered for this event.');

				if (redirectUrl) {
					router.push(`/events/${eid}/sessions/${sid}`).then(() => {
						void queryClient.invalidateQueries(['attendees', eid, sid]);
						void queryClient.invalidateQueries(['session', eid, sid]);
						void queryClient.invalidateQueries(['isSessionAttendee', eid, sid]);
						if (userId) {
							void queryClient.invalidateQueries(['attendee', eid, sid, userId]);
						}
					});
				} else {
					void queryClient.invalidateQueries(['attendees', eid, sid]);
					void queryClient.invalidateQueries(['session', eid, sid]);
					void queryClient.invalidateQueries(['isSessionAttendee', eid, sid]);
					if (userId) {
						void queryClient.invalidateQueries(['attendee', eid, sid, userId]);
					}
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionAttendeeMutation };
};
