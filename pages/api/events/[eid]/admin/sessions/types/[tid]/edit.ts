import { NextkitError } from 'nextkit';
import { EditSessionTypeSchema } from '../../../../../../../../utils/schemas';
import { getEvent } from '../../../../index';
import { getSessionType } from '../../../../sessions/types/[tid]';
import { isOrganizer } from '../../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../../utils/api';
import { generateSlug } from '../../../../../../../../utils/generateSlug';
import { prisma } from '../../../../../../../../prisma/client';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, tid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}
		let parsed = EditSessionTypeSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const sessionType = await getSessionType(String(eid), String(tid));

		if (!sessionType) {
			throw new NextkitError(404, 'Session Type not found.');
		}

		const slug: string | undefined =
			parsed.name !== sessionType.name
				? await generateSlug(parsed.name, async (val) => {
						return !Boolean(
							await prisma.eventSession.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		const editedSession = await prisma.eventSessionType.update({
			where: {
				id: sessionType.id
			},
			data: {
				eventId: event.id,
				slug,
				name: parsed.name,
				color: parsed.color
			}
		});

		if (!editedSession) {
			throw new NextkitError(500, 'Error editing session type.');
		}

		return editedSession;
	}
});
