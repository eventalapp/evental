import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditVenueSchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/attendee';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, vid } = req.query;

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

		const body = EditVenueSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const venue = await prisma.eventVenue.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(vid) }, { slug: String(vid) }]
			},
			select: {
				id: true,
				name: true
			}
		});

		if (!venue) {
			throw new NextkitError(404, 'Venue not found.');
		}

		if (body.name !== venue.name) {
			const venueNameExists = await prisma.eventVenue.findFirst({
				where: {
					name: body.name
				}
			});

			if (venueNameExists) {
				throw new NextkitError(400, `Venue with the name "${body.name}" already exists.`);
			}
		}

		const slug: string | undefined =
			body.name !== venue.name
				? await generateSlug(body.name, async (val) => {
						return !Boolean(
							await prisma.eventVenue.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		const editedVenue = await prisma.eventVenue.update({
			where: {
				id: venue.id
			},
			data: {
				name: body.name,
				description: body.description,
				address: body.address,
				slug: slug
			}
		});

		if (!editedVenue) {
			throw new NextkitError(500, 'Venue failed to update.');
		}

		return editedVenue;
	},

	async DELETE({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid, vid } = req.query;

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

		const venue = await prisma.eventVenue.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(vid) }, { slug: String(vid) }]
			},
			select: {
				id: true
			}
		});

		if (!venue) {
			throw new NextkitError(404, 'Venue not found.');
		}

		await prisma.eventVenue.delete({
			where: {
				id: venue.id
			}
		});
	}
});
