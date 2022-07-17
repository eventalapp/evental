import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import { NextkitError } from 'nextkit';
import sharp, { FormatEnum } from 'sharp';

import { uploadToBucket } from './file';

interface ProcessImageOptions {
	height: number;
	background: string;
	toFormat: keyof FormatEnum;
}

export const processImage = async (
	input:
		| Buffer
		| Uint8Array
		| Uint8ClampedArray
		| Int8Array
		| Uint16Array
		| Int16Array
		| Uint32Array
		| Int32Array
		| Float32Array
		| Float64Array
		| string,
	options: ProcessImageOptions = {
		height: 800,
		background: '#e8e8e8',
		toFormat: 'jpg'
	}
) => {
	const { background, toFormat, height } = options;

	return await sharp(input)
		.flatten({ background })
		.resize({ height })
		.rotate()
		.toFormat(toFormat)
		.toBuffer()
		.catch((error) => {
			if (error instanceof Error) {
				throw new NextkitError(500, error.message);
			}

			throw new NextkitError(500, 'An error has occurred while parsing the image.');
		});
};

interface ProcessAvatarOptions {
	width: number;
	height: number;
	toFormat: keyof FormatEnum;
}

export const processAvatar = async (
	input:
		| Buffer
		| Uint8Array
		| Uint8ClampedArray
		| Int8Array
		| Uint16Array
		| Int16Array
		| Uint32Array
		| Int32Array
		| Float32Array
		| Float64Array
		| string,
	options: ProcessAvatarOptions = {
		height: 300,
		width: 300,
		toFormat: 'png'
	}
) => {
	const { height, width, toFormat } = options;

	return await sharp(input)
		.rotate()
		.resize({
			height,
			width
		})
		.toFormat(toFormat)
		.toBuffer()
		.catch((error) => {
			if (error instanceof Error) {
				throw new NextkitError(500, error.message);
			}

			throw new NextkitError(500, 'An error has occurred while parsing the image.');
		});
};

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
