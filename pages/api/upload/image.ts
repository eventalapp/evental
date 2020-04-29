import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { S3 } from 'aws-sdk';
import { ServerErrorResponse } from '../../../utils/ServerError';
import crypto from 'crypto';
import { busboyParseForm } from '../../../utils/busboyParseForm';
import { uploadToBucket } from '../../../utils/uploadToBucket';
import { processImage } from '../../../utils/processImage';
import { handleServerError } from '../../../utils/handleServerError';

export const config = {
	api: {
		bodyParser: false
	}
};

export type ImageUploadResponse = {
	pathName: string;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | ImageUploadResponse>
) => {
	if (req.method === 'POST') {
		try {
			const session = await getSession({ req });

			if (!session?.user?.id) {
				return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
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
				return res.status(500).send({ error: { message: 'Image failed to upload.' } });
			}

			const body: ImageUploadResponse = {
				pathName: fileLocation
			};

			res.status(200).send(body);
		} catch (error) {
			return handleServerError(error, res);
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}
};
