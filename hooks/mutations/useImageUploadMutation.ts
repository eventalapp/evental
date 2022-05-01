import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { ImageUploadPayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';
import { toast } from 'react-toastify';
import { ImageUploadResponse } from '../../pages/api/upload/image';
import { useState } from 'react';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseImageUploadMutationData {
	imageUploadMutation: UseMutationResult<
		SuccessAPIResponse<ImageUploadResponse>,
		AxiosError<ErroredAPIResponse, unknown>,
		ImageUploadPayload
	>;
	imageUploadResponse: ImageUploadResponse | undefined;
}

export const useImageUploadMutation = (): UseImageUploadMutationData => {
	const [imageUploadResponse, setImageUploadResponse] = useState<ImageUploadResponse>();

	const imageUploadMutation = useMutation<
		SuccessAPIResponse<ImageUploadResponse>,
		AxiosError<ErroredAPIResponse, unknown>,
		ImageUploadPayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.post<SuccessAPIResponse<ImageUploadResponse>>('/api/upload/image', formData)
				.then((res) => res.data);
		},
		{
			onSuccess: (response) => {
				setImageUploadResponse(response.data);
				toast.success('Image successfully uploaded');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { imageUploadMutation, imageUploadResponse };
};