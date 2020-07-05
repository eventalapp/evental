import { NextkitError } from 'nextkit';

import { getEvent } from '../..';
import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { sendEventMessageEmail } from '../../../../../../utils/email/sendEventMessageEmail';
import { SendEventMessageSchema } from '../../../../../../utils/schemas';

export default api({
	async POST({ req }) {
		const body = SendEventMessageSchema.parse(req.body);

		const event = await getEvent(String(body.eventId));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		await prisma.eventMessage.create({
			data: {
				body: body.body,
				title: body.title,
				eventId: body.eventId,
				sentBy: body.sentBy
			}
		});

		await sendEventMessageEmail({
			event,
			sendToAddresses: [''],
			body: body.body,
			title: body.title,
			sentBy: body.sentBy
		});
	}
});
