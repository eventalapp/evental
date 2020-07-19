import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid, mid } = req.query;

		const message = await getMessage(String(eid), String(mid));

		if (!message) {
			throw new NextkitError(404, 'Message not found');
		}

		return message;
	}
});

export const getMessage = async (eid: string, mid: string): Promise<Prisma.EventMessage | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const message = await prisma.eventMessage.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: String(mid) }, { slug: String(mid) }]
		}
	});

	if (!message) {
		return null;
	}

	return message;
};
