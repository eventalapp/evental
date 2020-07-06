import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseMessageData {
	message: Prisma.EventMessage | undefined;
	isMessageLoading: boolean;
	messageError: ErroredAPIResponse | null;
}

export interface UseMessageOptions {
	initialData?: Prisma.EventMessage | undefined;
}

export const useMessage = (
	eid: string,
	mid: string,
	args: UseMessageOptions = {}
): UseMessageData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: message, isLoading: isMessageLoading } = useQuery<
		Prisma.EventMessage,
		AxiosError<ErroredAPIResponse>
	>(
		['message', eid, mid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventMessage>>(`/api/events/${eid}/messages/${mid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && mid !== undefined && mid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { message, isMessageLoading, messageError: error };
};
