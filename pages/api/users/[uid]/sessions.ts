import Prisma from '@prisma/client';
import { api } from '../../../../utils/api';
import { NextkitError } from 'nextkit';
import { getUser } from './index';
import { prisma } from '../../../../prisma/client';
import { SessionWithVenue } from '../../events/[eid]/sessions';

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;

export default api({
	async GET({ req }) {
		const { uid } = req.query;

		const sessionList = await getSessionsByUser(String(uid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessionsByUser = async (uid: string): Promise<SessionWithVenueEvent[] | null> => {
	const user = await getUser(uid);

	if (!user) {
		return null;
	}

	return await prisma.eventSession.findMany({
		where: {
			attendees: {
				some: {
					attendee: {
						user: {
							id: user.id
						}
					}
				}
			}
		},
		include: {
			event: true,
			venue: true,
			type: true,
			attendees: {
				include: {
					attendee: {
						include: {
							user: {
								select: {
									id: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});
};
