import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditUserPayload, StrippedUser } from '@eventalapp/shared/utils';

import { populateFormData } from '../../utils/form';

export interface UseEditUserMutationData {
	editUserMutation: UseMutationResult<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		EditUserPayload
	>;
}

export const useEditUser = (eid: string, uid: string): UseEditUserMutationData => {
	const queryClient = useQueryClient();

	const editUserMutation = useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		EditUserPayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.put<SuccessAPIResponse<Prisma.User>>(
					`/api/events/${eid}/admin/attendees/${uid}/user/edit`,
					formData
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('User edited successfully');

				router.push(`/events/${eid}/admin/attendees`).then(() => {
					void queryClient.refetchQueries(['user', uid]);
					void queryClient.refetchQueries(['full-user', uid]);
					void queryClient.refetchQueries(['user']);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editUserMutation };
};
