import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { ClaimProfilePayload } from '@eventalapp/shared/utils';

export interface UseClaimProfileData {
	claimProfileMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ClaimProfilePayload
	>;
}

export const useClaimProfile = (): UseClaimProfileData => {
	const queryClient = useQueryClient();

	const claimProfileMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ClaimProfilePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/auth/claim`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push('/').then(() => {
					toast.success('You have claimed your profile.');
					void queryClient.invalidateQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { claimProfileMutation };
};
