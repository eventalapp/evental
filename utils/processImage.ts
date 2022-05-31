import { NextkitError } from 'nextkit';
import sharp, { FormatEnum } from 'sharp';

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
		toFormat: 'jpg'
	}
) => {
	const { height, width, toFormat } = options;

	return await sharp(input)
		.flatten()
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
