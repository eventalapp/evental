import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditEventMessageSchema } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { isOrganizer } from '../../../../../../utils/attendee';
import { getEvent } from '../../index';
import { getMessage } from '../../messages/[mid]';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, mid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const body = EditEventMessageSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const message = await getMessage(String(eid), String(mid));

		if (!message) {
			throw new NextkitError(404, 'Message not found.');
		}

		let editedMessage = await prisma.eventMessage.update({
			where: {
				id: message.id
			},
			data: {
				title: body.title,
				body: body.body
			}
		});

		if (!editedMessage) {
			throw new NextkitError(500, 'Failed to edit message.');
		}

		return editedMessage;
	},
	async DELETE({ req, ctx }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, mid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const message = await getMessage(String(eid), String(mid));

		if (!message) {
			throw new NextkitError(404, 'Message not found.');
		}

		await prisma.eventMessage.delete({
			where: {
				id: message.id
			}
		});
	}
});
