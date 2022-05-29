import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateVenuePayload } from '../../utils/schemas';

export interface UseCreateVenueMutationData {
	createVenueMutation: UseMutationResult<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateVenuePayload
	>;
}

interface UseCreateSessionOptions {
	redirect?: boolean;
}

export const useCreateVenueMutation = (
	eid: string,
	args: UseCreateSessionOptions = {}
): UseCreateVenueMutationData => {
	const { redirect = true } = args;

	const queryClient = useQueryClient();

	const createVenueMutation = useMutation<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateVenuePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventVenue>>(`/api/events/${eid}/admin/venues/create`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Venue created successfully');

				if (redirect) {
					router.push(`/events/${eid}/admin/venues/${data.slug}`).then(() => {
						void queryClient.invalidateQueries(['venues', eid]);
					});
				} else {
					void queryClient.invalidateQueries(['venues', eid]);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createVenueMutation };
};
