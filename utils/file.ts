import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { NextkitError } from 'nextkit';

export const uploadToBucket = (params: S3.Types.PutObjectRequest): Promise<string> => {
	const s3 = new AWS.S3({
		accessKeyId: process.env.EVENTAL_AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.EVENTAL_AWS_SECRET_ACCESS_KEY
	});

	return new Promise((resolve) => {
		s3.upload(params, async (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
			if (error) {
				throw new NextkitError(500, error.message);
			}

			let fileLocation = new URL(data?.Location);

			resolve(fileLocation.pathname);
		});
	});
};
