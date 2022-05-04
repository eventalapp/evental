import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditVenuePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseEditVenueMutationData {
	editVenueMutation: UseMutationResult<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		EditVenuePayload
	>;
}

export const useEditVenueMutation = (eid: string, vid: string): UseEditVenueMutationData => {
	const queryClient = useQueryClient();

	const editVenueMutation = useMutation<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		EditVenuePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventVenue>>(
					`/api/events/${eid}/admin/venues/${vid}/edit`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Venue edited successfully');

				router.push(`/events/${eid}/admin/venues/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['venue', eid, vid]);
					void queryClient.invalidateQueries(['venues', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editVenueMutation };
};
