import { useStripe } from '@stripe/react-stripe-js';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Stripe from 'stripe';

import { PurchaseProPayload } from '@eventalapp/shared/utils';

import { UpgradeResponse, UpgradeResponsePayload } from '../../pages/api/payment/sessions';

export interface UseUpgradeEventMutationData {
	upgradeEventMutation: UseMutationResult<
		UpgradeResponse,
		AxiosError<ErroredAPIResponse, unknown>,
		PurchaseProPayload
	>;
}

export const useUpgradeEvent = (eid: string): UseUpgradeEventMutationData => {
	const queryClient = useQueryClient();

	const stripe = useStripe();

	const upgradeEventMutation = useMutation<
		UpgradeResponse,
		AxiosError<ErroredAPIResponse, unknown>,
		PurchaseProPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<UpgradeResponse>>('/api/payment/sessions', data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: async (data) => {
				void (await queryClient.invalidateQueries('events'));
				void (await queryClient.invalidateQueries(['event', eid]));

				if ((data as UpgradeResponsePayload)?.upgraded) {
					toast.success('Your event has been upgraded');
					return;
				}

				const { error } = await stripe!.redirectToCheckout({
					sessionId: (data as Stripe.Checkout.Session)?.id
				});

				if (error) {
					toast.error(error.message ?? 'Something went wrong. Please try again.');
					return;
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { upgradeEventMutation };
};
