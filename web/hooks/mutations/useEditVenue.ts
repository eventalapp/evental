import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditVenuePayload } from '@eventalapp/shared/utils';

export interface UseEditVenueMutationData {
	editVenueMutation: UseMutationResult<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		EditVenuePayload
	>;
}

export const useEditVenue = (eid: string, vid: string): UseEditVenueMutationData => {
	const queryClient = useQueryClient();

	const editVenueMutation = useMutation<
		Prisma.EventVenue,
		AxiosError<ErroredAPIResponse, unknown>,
		EditVenuePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventVenue>>(`/api/events/${eid}/admin/venues/${vid}`, data)
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
