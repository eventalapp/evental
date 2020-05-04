import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditSessionPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseEditSessionMutationData {
	editSessionMutation: UseMutationResult<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionPayload
	>;
}

export const useEditSessionMutation = (eid: string, sid: string): UseEditSessionMutationData => {
	const queryClient = useQueryClient();

	const editSessionMutation = useMutation<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionPayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventSession>>(
					`/api/events/${eid}/admin/sessions/${sid}/edit`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Session edited successfully');

				router.push(`/events/${eid}/admin/sessions/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['session', eid, sid]);
					void queryClient.invalidateQueries(['sessions', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editSessionMutation };
};
