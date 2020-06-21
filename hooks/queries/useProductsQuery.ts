import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Stripe from 'stripe';

export interface UseProductsQueryData {
	productsData: Stripe.Product[] | undefined;
	isProductsLoading: boolean;
	productsError: ErroredAPIResponse | null;
}

export interface UseProductsQueryOptions {
	initialData?: Stripe.Product[] | undefined;
}

export const useProductsQuery = (
	eid: string,
	args: UseProductsQueryOptions = {}
): UseProductsQueryData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: productsData, isLoading: isProductsLoading } = useQuery<
		Stripe.Product[],
		AxiosError<ErroredAPIResponse>
	>(
		['products'],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Stripe.Product[]>>(`/api/products`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { productsData, isProductsLoading, productsError: error };
};
