import { processImage } from './processImage';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import { uploadToBucket } from './uploadToBucket';

export const uploadAndProcessImage = async (buffer: Buffer, mimeType: string | undefined) => {
	let fileLocation: string | undefined;

	if (buffer.length >= 1 && mimeType) {
		const sharpImage = await processImage(buffer);

		const params: S3.Types.PutObjectRequest = {
			Bucket: 'evental/images',
			Key: `${crypto.randomBytes(20).toString('hex')}.jpg`,
			Body: sharpImage,
			ContentType: mimeType
		};

		fileLocation = await uploadToBucket(params);
	}

	return fileLocation;
};
