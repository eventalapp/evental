import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import { busboyParseForm } from '../../../utils/busboyParseForm';
import { uploadToBucket } from '../../../utils/uploadToBucket';
import { processImage } from '../../../utils/processImage';
import { api } from '../../../utils/api';
import { NextkitError } from 'nextkit';

export const config = {
	api: {
		bodyParser: false
	}
};

export type ImageUploadResponse = {
	pathName: string;
};

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const { buffer, mimeType } = await busboyParseForm(req);

		let fileLocation: string | undefined;

		if (buffer.length >= 1) {
			const sharpImage = await processImage(buffer);

			const params: S3.Types.PutObjectRequest = {
				Bucket: 'evental/images',
				Key: `${crypto.randomBytes(20).toString('hex')}.jpg`,
				Body: sharpImage,
				ContentType: mimeType
			};

			fileLocation = await uploadToBucket(params);
		}

		if (!fileLocation) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		const body: ImageUploadResponse = {
			pathName: fileLocation
		};

		return body;
	}
});
