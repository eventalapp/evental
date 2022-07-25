import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditPageSchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/attendee';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, pid } = req.query;

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

		const body = EditPageSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const page = await prisma.eventPage.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(pid) }, { slug: String(pid) }]
			},
			select: {
				id: true,
				name: true
			}
		});

		if (!page) {
			throw new NextkitError(404, 'Page not found.');
		}

		const slug =
			body.name !== page.name
				? await generateSlug(body.name, async (val) => {
						return !Boolean(
							await prisma.eventPage.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		let editedPage = await prisma.eventPage.update({
			where: {
				id: page.id
			},
			data: {
				slug: slug,
				body: body.body,
				name: body.name,
				topLevel: body.topLevel
			}
		});

		if (!editedPage) {
			throw new NextkitError(500, 'Failed to edit page.');
		}

		return editedPage;
	},
	async DELETE({ req, ctx }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, pid } = req.query;

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

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const page = await prisma.eventPage.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(pid) }, { slug: String(pid) }]
			},
			select: {
				id: true
			}
		});

		if (!page) {
			throw new NextkitError(404, 'Page not found.');
		}

		await prisma.eventPage.delete({
			where: {
				id: page.id
			}
		});
	}
});
