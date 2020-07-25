import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { ImageUploadPayload } from '@eventalapp/shared/utils';

import { ImageUploadResponse } from '../../pages/api/upload/image';
import { populateFormData } from '../../utils/form';

export interface UseImageUploadMutationData {
	imageUploadMutation: UseMutationResult<
		SuccessAPIResponse<ImageUploadResponse>,
		AxiosError<ErroredAPIResponse | Error, unknown>,
		ImageUploadPayload
	>;
	imageUploadResponse: ImageUploadResponse | undefined;
}

export const useImageUpload = (): UseImageUploadMutationData => {
	const [imageUploadResponse, setImageUploadResponse] = useState<ImageUploadResponse>();

	const imageUploadMutation = useMutation<
		SuccessAPIResponse<ImageUploadResponse>,
		AxiosError<ErroredAPIResponse | Error, unknown>,
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
				toast.error(error?.message || error?.response?.data.message || 'An error has occurred.');
			}
		}
	);

	return { imageUploadMutation, imageUploadResponse };
};
