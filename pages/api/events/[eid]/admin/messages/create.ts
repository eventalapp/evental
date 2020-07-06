import { NextkitError } from 'nextkit';

import { getEvent } from '../..';
import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { sendEventMessageEmail } from '../../../../../../utils/email/sendEventMessageEmail';
import { SendEventMessageSchema } from '../../../../../../utils/schemas';
import { generateSlug } from '../../../../../../utils/string';

export default api({
	async POST({ req }) {
		const body = SendEventMessageSchema.parse(req.body);

		const event = await getEvent(String(body.eventId));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		const slug = await generateSlug(body.title, async (val) => {
			return !Boolean(
				await prisma.eventMessage.findFirst({
					where: {
						slug: val
					}
				})
			);
		});

		const message = await prisma.eventMessage.create({
			data: {
				body: body.body,
				title: body.title,
				eventId: body.eventId,
				sentBy: body.sentBy,
				sendTo: body.sendType,
				slug,
				roleId: body.roleId
			}
		});

		let sendToAddresses: Array<string> = [];

		if (body.sendType === 'EVERYONE') {
			const attendees = await prisma.eventAttendee.findMany({
				where: {
					eventId: event.id
				},
				select: {
					user: {
						select: {
							email: true
						}
					}
				}
			});

			sendToAddresses = sendToAddresses.concat(
				attendees
					.map((attendee) => attendee.user.email)
					.filter((email) => email !== null) as Array<string>
			);
		}

		await sendEventMessageEmail({
			event,
			toAddresses: sendToAddresses,
			body: body.body,
			title: body.title,
			sentBy: body.sentBy
		});

		return message;
	}
});
