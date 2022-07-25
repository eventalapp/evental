import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';

interface UseSignOutArgs {
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: void, variables: void, context: unknown) => void;
}

export const useSignOut = (args: UseSignOutArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<void, ErroredAPIResponse, void>(
		async () => {
			return await api
				.delete<SuccessAPIResponse<void>>(`/auth/signout`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.refetchQueries('user');

				onSuccess?.(...rest);
			},
			onError
		}
	);
};
