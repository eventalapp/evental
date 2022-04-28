import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { ServerError } from './ServerError';

export const uploadToBucket = (params: S3.Types.PutObjectRequest): Promise<string> => {
	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	return new Promise((resolve, reject) => {
		s3.upload(params, async (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
			if (error) {
				reject(new ServerError(error.message));
			}

			let fileLocation = new URL(data.Location);

			resolve(fileLocation.pathname);
		});
	});
};
