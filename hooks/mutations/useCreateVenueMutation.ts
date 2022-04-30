import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateVenuePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseCreateVenueMutationData {
	createVenueMutation: UseMutationResult<
		AxiosResponse<Prisma.EventVenue, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateVenuePayload
	>;
}

export const useCreateVenueMutation = (eid: string): UseCreateVenueMutationData => {
	const queryClient = useQueryClient();

	const createVenueMutation = useMutation<
		AxiosResponse<Prisma.EventVenue, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateVenuePayload
	>(
		async (data) => {
			return await axios.post<Prisma.EventVenue>(`/api/events/${eid}/admin/venues/create`, data);
		},
		{
			onSuccess: (response) => {
				toast.success('Venue created successfully');

				router.push(`/events/${eid}/venues/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.message ?? 'An error has occurred.');
			}
		}
	);

	return { createVenueMutation };
};
