import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { FullUser } from '../../types';

export const useUser = () => {
	return useQuery<FullUser | null, ErroredAPIResponse | null>(['user'], async () => {
		return await api
			.get<SuccessAPIResponse<FullUser>>(`/user`)
			.then((res) => res.data.data)
			.catch((err: AxiosError<ErroredAPIResponse>) => {
				throw err.response?.data;
			});
	});
};
