import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateVenuePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateVenueMutationData {
	createVenueMutation: UseMutationResult<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateVenuePayload
	>;
}

export const useCreateVenueMutation = (eid: string): UseCreateVenueMutationData => {
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

				router.push(`/events/${eid}/venues/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createVenueMutation };
};
