import Prisma from '@prisma/client';
import { api } from '../../../../utils/api';
import { NextkitError } from 'nextkit';
import { getUser } from './index';
import { prisma } from '../../../../prisma/client';
import { PageOptions, PaginationData, SessionWithVenue } from '../../events/[eid]/sessions';

export const SESSIONS_PER_PAGE = 24;

export type PaginatedSessionsWithVenueEvent = {
	sessions: SessionWithVenueEvent[];
	pagination: PaginationData;
};

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;

export default api({
	async GET({ req }) {
		const { uid, page } = req.query;
		const pageParsed = page ? parseInt(String(page)) : 1;

		const sessionList = await getSessionsByUser(String(uid), {
			page: pageParsed
		});

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessionsByUser = async (
	uid: string,
	args: PageOptions = {}
): Promise<PaginatedSessionsWithVenueEvent | null> => {
	const { page = 1 } = args || {};

	const user = await getUser(uid);

	if (!user) {
		return null;
	}

	const count = await prisma.eventSession.count({
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
		}
	});

	const sessions = await prisma.eventSession.findMany({
		take: SESSIONS_PER_PAGE,
		skip: (page - 1) * SESSIONS_PER_PAGE,
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
		}
	});

	return {
		sessions,
		pagination: {
			total: count,
			pageCount: Math.ceil(count / SESSIONS_PER_PAGE),
			currentPage: page,
			perPage: SESSIONS_PER_PAGE,
			from: (page - 1) * SESSIONS_PER_PAGE + 1,
			to: (page - 1) * SESSIONS_PER_PAGE + sessions.length
		}
	};
};
