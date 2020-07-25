import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { SendEventMessageSchema, generateSlug } from '@eventalapp/shared/utils';

import { getEvent } from '../..';
import { sendEventMessage } from '../../../../../../email/templates/eventMessage';
import { api } from '../../../../../../utils/api';

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

		let sendToAddresses: Array<string> = [];

		if (body.sendType === 'EVERYONE') {
			const attendees = await prisma.eventAttendee.findMany({
				where: {
					eventId: event.id,
					user: {
						notificationPreference: {
							some: {
								event: true
							}
						}
					}
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
		} else if (body.sendType === 'ROLE') {
			const attendees = await prisma.eventAttendee.findMany({
				where: {
					eventId: event.id,
					eventRoleId: body.roleId,
					user: {
						notificationPreference: {
							some: {
								event: true
							}
						}
					}
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

		const message = await prisma.eventMessage.create({
			data: {
				body: body.body,
				title: body.title,
				eventId: event.id,
				sendTo: body.sendType,
				slug,
				roleId: body.roleId,
				recipientCount: sendToAddresses.length
			}
		});

		if (!message) {
			throw new NextkitError(500, 'Failed to create message');
		}

		await sendEventMessage({
			event,
			toAddresses: sendToAddresses,
			body: body.body,
			title: body.title,
			message
		});

		return message;
	}
});
