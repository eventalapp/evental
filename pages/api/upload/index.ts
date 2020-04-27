import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import * as AWS from 'aws-sdk';
import { parse } from 'parse-multipart-data';
import sharp from 'sharp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	// const fileContent = fs.readFileSync(`${process.cwd()}/public/images/logo.svg`);
	//
	// //sharp image optimizer
	// //nsfw js with tfjs-node
	//

	//
	// s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
	// 	if (err) {
	// 		throw err;
	// 	}
	// 	console.log(`File uploaded successfully. ${data.Location}`);
	// });
	// console.log(req.headers['content-type']?.split(';'));

	// if (!session?.user?.id) {
	// 	return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	// }

	if (req.method === 'POST') {
		const contentTypes = req.headers['content-type']?.split(';');

		if (contentTypes && contentTypes[0] === 'multipart/form-data') {
			if (contentTypes[1].includes('boundary')) {
				const boundary = contentTypes[1].trim().split('=')[1];

				const buffer = Buffer.from(req.body, 'binary');

				const parts = parse(buffer, boundary);

				let files: AWS.S3.Types.PutObjectRequest[] = [];

				for (let i = 0; i < parts.length; i++) {
					console.log(parts[i]);

					// const fileExtension = parts[i].filename?.split('.').pop();
					//
					// files.push({
					// 	Bucket: 'evental/images',
					// 	Key: 'logoff.svg',
					// 	Body: parts[i].data
					// });

					// parts[i].data;

					const processedImage = await sharp(parts[i].data)
						.rotate()
						.resize({
							height: 300,
							width: 300
						})
						.toFormat('jpeg')
						.toBuffer();

					console.log(processedImage);
				}

				// const params = {
				// 	Bucket: 'evental/images',
				// 	Key: 'logoff.svg',
				// 	Body: fileContent
				// };

				// s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
				// 	if (err) {
				// 		throw err;
				// 	}
				// 	console.log(`File uploaded successfully. ${data.Location}`);
				// });

				return res.status(200).send('ok');
			} else {
				return res.status(400).send({ error: { message: 'Invalid content type' } });
			}
		} else {
			return res.status(400).send({ error: { message: 'Must be of type multipart/form-data' } });
		}
	}

	return res.status(400).send({ error: { message: 'Invalid request type' } });
};
