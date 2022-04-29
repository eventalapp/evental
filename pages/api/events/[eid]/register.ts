import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { S3 } from 'aws-sdk';
import crypto from 'crypto';
import type Prisma from '@prisma/client';
import { uploadToBucket } from '../../../../utils/uploadToBucket';
import { busboyParseForm } from '../../../../utils/busboyParseForm';
import { processImage } from '../../../../utils/processImage';
import { ServerErrorResponse } from '../../../../utils/ServerError';
import { CreateAttendeeSchema } from '../../../../utils/schemas';
import { handleServerError } from '../../../../utils/handleServerError';
import { prisma } from '../../../../prisma/client';
import { getEvent } from './index';

export const config = {
	api: {
		bodyParser: false
	}
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	if (req.method === 'POST') {
		try {
			const { eid } = req.query;

			const session = await getSession({ req });

			if (!session?.user?.id) {
				return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
			}

			const event = await getEvent(String(eid));

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const isAttendeeAlready = await prisma.eventAttendee.findFirst({
				where: {
					eventId: event.id,
					userId: String(session.user.id)
				}
			});

			if (isAttendeeAlready) {
				return res
					.status(401)
					.send({ error: { message: 'You are already attending this event.' } });
			}

			const { buffer, formData, mimeType } = await busboyParseForm(req);
			const parsed = CreateAttendeeSchema.parse(formData);
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

			const defaultRole = await prisma.eventRole.findFirst({
				where: {
					defaultRole: true
				}
			});

			if (!defaultRole) {
				return res.status(404).send({ error: { message: 'Role not found.' } });
			}

			const eventAttendee = await prisma.eventAttendee.create({
				data: {
					slug: parsed.slug,
					name: parsed.name,
					image: fileLocation,
					company: parsed.company,
					position: parsed.position,
					description: parsed.description,
					eventRoleId: defaultRole?.id,
					userId: session.user.id,
					eventId: event.id,
					permissionRole: 'ATTENDEE'
				}
			});

			if (!eventAttendee) {
				return res.status(500).send({ error: { message: 'Could not create attendee.' } });
			}

			res.status(200).send(eventAttendee);
		} catch (error) {
			return handleServerError(error, res);
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}
};
