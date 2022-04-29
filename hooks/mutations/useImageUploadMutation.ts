import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { ServerError } from '../../typings/error';
import { ImageUploadPayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';
import { toast } from 'react-toastify';
import { ImageUploadResponse } from '../../pages/api/upload/image';
import { useState } from 'react';

export interface UseImageUploadMutationData {
	imageUploadMutation: UseMutationResult<
		ImageUploadResponse,
		AxiosError<ServerError, unknown>,
		ImageUploadPayload
	>;
	imageUploadResponse: ImageUploadResponse | undefined;
}

export const useImageUploadMutation = (): UseImageUploadMutationData => {
	const [imageUploadResponse, setImageUploadResponse] = useState<ImageUploadResponse>();

	const imageUploadMutation = useMutation<
		ImageUploadResponse,
		AxiosError<ServerError, unknown>,
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
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { imageUploadMutation, imageUploadResponse };
};
