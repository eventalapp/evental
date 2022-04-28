import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { S3 } from 'aws-sdk';
import { CreateEventSchema } from '../../../utils/schemas';
import prisma from '../../../prisma/client';
import { ServerErrorResponse } from '../../../utils/ServerError';
import crypto from 'crypto';
import type Prisma from '@prisma/client';
import { busboyParseForm } from '../../../utils/busboyParseForm';
import { uploadToBucket } from '../../../utils/uploadToBucket';
import { processImage } from '../../../utils/processImage';
import { handleServerError } from '../../../utils/handleServerError';

export const config = {
	api: {
		bodyParser: false
	}
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event>
) => {
	if (req.method === 'POST') {
		try {
			const session = await getSession({ req });

			if (!session?.user?.id) {
				return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
			}

			const { buffer, formData, mimeType } = await busboyParseForm(req);
			const parsed = CreateEventSchema.parse(formData);
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

			const event = await prisma.event.create({
				data: {
					slug: parsed.slug,
					name: parsed.name,
					location: parsed.location,
					startDate: parsed.startDate,
					endDate: parsed.endDate,
					description: parsed.description,
					image: fileLocation
				}
			});

			if (!event) {
				return res.status(500).send({ error: { message: 'Could not create event.' } });
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
				return res.status(500).send({ error: { message: 'Could not create role.' } });
			}

			let eventAttendee = await prisma.eventAttendee.create({
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
				return res.status(500).send({ error: { message: 'Could not create attendee.' } });
			}

			res.status(200).send(event);
		} catch (error) {
			return handleServerError(error, res);
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}
};
