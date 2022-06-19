import { S3 } from 'aws-sdk';
import crypto from 'crypto';

import { processAvatar, processImage } from './processImage';
import { uploadToBucket } from './uploadToBucket';

export const uploadAndProcessAvatar = async (buffer: Buffer, mimeType: string | undefined) => {
	let fileLocation: string | undefined;

	if (buffer.length >= 1 && mimeType) {
		const sharpImage = await processAvatar(buffer, { toFormat: 'png', height: 300, width: 300 });

		const params: S3.Types.PutObjectRequest = {
			Bucket: 'evental/images',
			Key: `${crypto.randomBytes(20).toString('hex')}.png`,
			Body: sharpImage,
			ContentType: mimeType
		};

		fileLocation = await uploadToBucket(params);
	}

	return fileLocation;
};

export const uploadAndProcessImage = async (buffer: Buffer, mimeType: string | undefined) => {
	let fileLocation: string | undefined;

	if (buffer.length >= 1 && mimeType) {
		const sharpImage = await processImage(buffer, {
			height: 800,
			background: '#e8e8e8',
			toFormat: 'jpg'
		});

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
