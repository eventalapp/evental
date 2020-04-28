import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Busboy from 'busboy';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { CreateEventSchema } from '../../../utils/schemas';
import prisma from '../../../prisma/client';
import { ServerError } from '../../../utils/ServerError';

export const config = {
	api: {
		bodyParser: false
	}
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (req.method === 'POST') {
		const bb = Busboy({ headers: req.headers });
		let chunks: Uint8Array[] = [];
		let filename: string | undefined;
		let mimeType: string | undefined;
		let encoding: string | undefined;
		let formData: Record<string, string> = {};

		bb.on('file', async (name, file, info) => {
			const { filename: filenameParsed, encoding: encodingParsed, mimeType: mimeTypeParsed } = info;

			filename = filenameParsed;
			encoding = encodingParsed;
			mimeType = mimeTypeParsed;

			file.on('data', async (data) => {
				chunks.push(data);
			});
		});

		bb.on('field', async (name, val) => {
			formData[name] = val;
		});

		bb.on('finish', async () => {
			const s3 = new AWS.S3({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
			});

			let sharpImage = await sharp(Buffer.concat(chunks))
				.flatten({ background: '#e8e8e8' })
				.rotate()
				.resize({
					height: 300,
					width: 300
				})
				.toFormat('jpeg')
				.toBuffer()
				.catch((error) => {
					throw new ServerError(error);
				});

			if (!sharpImage) {
				throw new ServerError('Could not process image.');
			}

			const params: S3.Types.PutObjectRequest = {
				Bucket: 'evental/images',
				Key: filename ?? 'filename.jpg',
				Body: sharpImage,
				ContentType: mimeType
			};

			s3.upload(params, async (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
				if (err) {
					throw new ServerError('Could not upload image.');
				}

				try {
					let fileLocation = new URL(data.Location);
					fileLocation.host = 'cdn.evental.app';

					const parsed = CreateEventSchema.parse(formData);

					const newEvent = await prisma.event.create({
						data: {
							slug: parsed.slug,
							name: parsed.name,
							location: parsed.location,
							startDate: parsed.startDate,
							endDate: parsed.endDate,
							description: parsed.description,
							image: fileLocation.href
						}
					});

					const attendeeRole = await prisma.eventRole.create({
						data: {
							name: 'ATTENDEE',
							slug: 'attendee',
							eventId: String(newEvent.id),
							defaultRole: true
						}
					});

					await prisma.eventAttendee.create({
						data: {
							slug: String('founder-slug'),
							eventId: newEvent.id,
							permissionRole: 'FOUNDER',
							userId: session.user.id,
							eventRoleId: String(attendeeRole.id),
							name: String(session.user.name)
						}
					});

					res.status(200).send(newEvent);
				} catch (error) {
					if (error instanceof ServerError) {
						return res.status(500).send(error);
					}
					return res.status(400).send('An error occurred while creating the event.');
				}
			});
		});

		req.pipe(bb);
	}
};
