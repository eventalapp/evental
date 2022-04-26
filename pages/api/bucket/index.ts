import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	const fileContent = fs.readFileSync(`${process.cwd()}/public/images/logo.svg`);

	//sharp image optimizer
	//nsfw js with tfjs-node

	const params = {
		Bucket: 'evental/images',
		Key: 'logoff.svg',
		Body: fileContent
	};

	s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
		if (err) {
			throw err;
		}
		console.log(`File uploaded successfully. ${data.Location}`);
	});

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	return res.status(204).end();
};
