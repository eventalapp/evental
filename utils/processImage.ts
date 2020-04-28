import sharp, { FormatEnum } from 'sharp';
import { ServerError } from './ServerError';

interface ProcessImageOptions {
	width: number;
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
		height: 300,
		width: 300,
		background: '#e8e8e8',
		toFormat: 'jpeg'
	}
) => {
	const { height, width, background, toFormat } = options;

	return await sharp(input)
		.flatten({ background })
		.rotate()
		.resize({
			height,
			width
		})
		.toFormat(toFormat)
		.toBuffer()
		.catch((error) => {
			if (error instanceof Error) {
				throw new ServerError(error.message);
			}

			throw new ServerError('An error has occurred while parsing the image.');
		});
};
