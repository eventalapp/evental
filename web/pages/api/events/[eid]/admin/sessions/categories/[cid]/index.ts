import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditSessionCategorySchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../../utils/attendee';
import { getEvent } from '../../../../index';
import { getSessionCategory } from '../../../../sessions/categories/[cid]';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, cid } = req.query;

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

		const sessionCategory = await prisma.eventSessionCategory.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(cid) }, { slug: String(cid) }]
			},
			select: {
				id: true
			}
		});

		if (!sessionCategory) {
			throw new NextkitError(404, 'Session not found.');
		}

		await prisma.eventSessionCategory.delete({
			where: {
				id: sessionCategory.id
			}
		});
	},
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, cid } = req.query;

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

		const body = EditSessionCategorySchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const sessionCategory = await getSessionCategory(String(eid), String(cid));

		if (!sessionCategory) {
			throw new NextkitError(404, 'Session category not found.');
		}

		const slug: string | undefined =
			body.name !== sessionCategory.name
				? await generateSlug(body.name, async (val) => {
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

		const editedSession = await prisma.eventSessionCategory.update({
			where: {
				id: sessionCategory.id
			},
			data: {
				eventId: event.id,
				slug,
				name: body.name,
				color: body.color
			}
		});

		if (!editedSession) {
			throw new NextkitError(500, 'Error editing session category.');
		}

		return editedSession;
	}
});
