import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { stripAttendeeWithUser } from '../../../../../../utils/user';
import { getEvent } from '../../index';
import { SessionWithVenue } from '../index';

export default api({
	async GET({ req }) {
		const { eid, sid } = req.query;

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		return session;
	}
});

export const getSession = async (eid: string, sid: string): Promise<SessionWithVenue | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const session = await prisma.eventSession.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: sid }, { slug: sid }]
		},
		include: {
			venue: true,
			category: true,
			_count: {
				select: { attendees: true }
			},
			attendees: {
				include: {
					attendee: {
						include: {
							user: true,
							role: true
						}
					}
				},
				where: {
					type: 'ROLE'
				}
			}
		}
	});

	if (!session) {
		return null;
	}

	return {
		attendeeCount: session._count.attendees,
		roleMembers: session.attendees.map((sessionAttendee) => {
			const { attendee } = sessionAttendee;

			return {
				...sessionAttendee,
				attendee: stripAttendeeWithUser(attendee)
			};
		}),
		...session
	};
};
