import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		return await getMessages(String(eid));
	}
});

export const getMessages = async (eid: string): Promise<Prisma.EventMessage[] | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	const messages = await prisma.eventMessage.findMany({
		where: {
			eventId: event.id,
			sendTo: 'EVERYONE'
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	if (!messages || messages.length === 0) {
		return [];
	}

	return messages;
};
