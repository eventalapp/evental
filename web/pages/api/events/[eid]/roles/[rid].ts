import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid, rid } = req.query;

		const role = await getRole(String(eid), String(rid));

		if (!role) {
			throw new NextkitError(404, 'Role not found');
		}

		return role;
	}
});

export const getRole = async (eid: string, rid: string): Promise<Prisma.EventRole | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const role = await prisma.eventRole.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: String(rid) }, { slug: String(rid) }]
		}
	});

	if (!role) {
		return null;
	}

	return role;
};
