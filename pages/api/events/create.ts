import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Busboy from 'busboy';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';
import { CreateEventSchema } from '../../../utils/schemas';
import prisma from '../../../prisma/client';
import { ServerError, ServerErrorResponse } from '../../../utils/ServerError';
import crypto from 'crypto';
import type Prisma from '@prisma/client';

export const config = {
	api: {
		bodyParser: false
	}
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event>
) => {
	const session = await getSession({ req });

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (req.method === 'POST') {
		try {
			const busboy = Busboy({ headers: req.headers });
			let chunks: Uint8Array[] = [];
			let filename: string | undefined;
			let mimeType: string | undefined;
			let encoding: string | undefined;
			let formData: Record<string, string> = {};

			busboy.on('file', async (name, file, info) => {
				const {
					filename: filenameParsed,
					encoding: encodingParsed,
					mimeType: mimeTypeParsed
				} = info;

				filename = filenameParsed;
				encoding = encodingParsed;
				mimeType = mimeTypeParsed;

				file.on('data', async (data) => {
					chunks.push(data);
				});
				file.on('error', (err) => {
					throw new ServerError(err.message, 500);
				});
			});

			busboy.on('field', async (name, val) => {
				formData[name] = val;
			});

			busboy.on('finish', async () => {
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
						throw new ServerError(error.message, 500);
					});

				if (!sharpImage) {
					throw new ServerError('Could not process image.', 500);
				}

				let fileExtension = filename?.split('.').pop();

				const params: S3.Types.PutObjectRequest = {
					Bucket: 'evental/images',
					Key: `${crypto.randomBytes(20).toString('hex')}.${fileExtension}`,
					Body: sharpImage,
					ContentType: mimeType
				};

				s3.upload(params, async (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
					if (err) {
						throw new ServerError(err.message, 500);
					}

					let fileLocation = new URL(data.Location);
					fileLocation.host = 'cdn.evental.app';

					const parsed = CreateEventSchema.parse(formData);

					const event = await prisma.event.create({
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

					if (!event) {
						throw new ServerError('Could not create event.', 500);
					}

					const eventRole = await prisma.eventRole.create({
						data: {
							name: 'ATTENDEE',
							slug: 'attendee',
							eventId: String(event.id),
							defaultRole: true
						}
					});

					if (!eventRole) {
						throw new ServerError('Could not create role.', 500);
					}

					let eventAttendee = prisma.eventAttendee.create({
						data: {
							slug: String('founder-slug'),
							eventId: event.id,
							permissionRole: 'FOUNDER',
							userId: session.user.id,
							eventRoleId: String(eventRole.id),
							name: String(session.user.name)
						}
					});

					if (!eventAttendee) {
						throw new ServerError('Could not create attendee.', 500);
					}

					res.status(200).send(event);
				});
			});

			req.pipe(busboy);
		} catch (error) {
			if (error instanceof ServerError) {
				return res.status(error.statusCode).send({ error: { message: error.message } });
			}

			return res.status(500).send({ error: { message: 'Something went wrong.' } });
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}
};
