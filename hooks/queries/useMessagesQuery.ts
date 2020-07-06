import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseMessagesQueryData {
	messages: Prisma.EventMessage[] | undefined;
	isMessagesLoading: boolean;
	messagesError: ErroredAPIResponse | null;
}

export interface UseMessagesQueryOptions {
	initialData?: Prisma.EventMessage[] | undefined;
}

export const useMessagesQuery = (
	eid: string,
	args: UseMessagesQueryOptions = {}
): UseMessagesQueryData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: messages, isLoading: isMessagesLoading } = useQuery<
		Prisma.EventMessage[],
		AxiosError<ErroredAPIResponse>
	>(
		['messages', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventMessage[]>>(`/api/events/${eid}/messages`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { messages, isMessagesLoading, messagesError: error };
};
