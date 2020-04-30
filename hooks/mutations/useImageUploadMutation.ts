import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { ImageUploadPayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';
import { toast } from 'react-toastify';
import { ImageUploadResponse } from '../../pages/api/upload/image';
import { useState } from 'react';
import { NextkitError } from 'nextkit';

export interface UseImageUploadMutationData {
	imageUploadMutation: UseMutationResult<
		ImageUploadResponse,
		AxiosError<NextkitError, unknown>,
		ImageUploadPayload
	>;
	imageUploadResponse: ImageUploadResponse | undefined;
}

export const useImageUploadMutation = (): UseImageUploadMutationData => {
	const [imageUploadResponse, setImageUploadResponse] = useState<ImageUploadResponse>();

	const imageUploadMutation = useMutation<
		ImageUploadResponse,
		AxiosError<NextkitError, unknown>,
		ImageUploadPayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.post<ImageUploadResponse>('/api/upload/image', formData)
				.then((res) => res.data);
		},
		{
			onSuccess: (response) => {
				setImageUploadResponse(response);
				toast.success('Image successfully uploaded');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { imageUploadMutation, imageUploadResponse };
};
