import Prisma from '@prisma/client';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../prisma/client';
import { api } from '../../../../../utils/api';
import {
	AttendeeWithUser,
	stripAttendeeWithUserPassword
} from '../../../../../utils/stripUserPassword';
import { getEvent } from '../index';
import { getVenue } from '../venues/[vid]';
import { getSessionCategory } from './categories/[cid]';

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: Prisma.EventSessionCategory | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;

export default api({
	async GET({ req }) {
		const { eid, venue, date, category } = req.query;

		if (venue) {
			const sessionByVenueList = await getSessionsByVenue(String(eid), String(venue));

			if (!sessionByVenueList) {
				throw new NextkitError(404, 'Sessions by venue not found');
			}

			return sessionByVenueList;
		}

		if (date) {
			const sessionByDateList = await getSessionsByDate(String(eid), String(date));

			if (!sessionByDateList) {
				throw new NextkitError(404, 'Sessions by date not found');
			}

			return sessionByDateList;
		}

		if (category) {
			const sessionByTypeList = await getSessionsByCategory(String(eid), String(category));

			if (!sessionByTypeList) {
				throw new NextkitError(404, 'Sessions by type not found');
			}

			return sessionByTypeList;
		}

		const sessionList = await getSessions(String(eid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessions = async (eid: string): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id
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
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({
		attendeeCount: session._count.attendees,
		roleMembers: session.attendees.map((sessionAttendee) => {
			const { attendee } = sessionAttendee;

			return {
				...sessionAttendee,
				attendee: stripAttendeeWithUserPassword(attendee)
			};
		}),
		...session
	}));
};

export const getSessionsByVenue = async (
	eid: string,
	vid: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const venue = await getVenue(eid, vid);

	if (!venue) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			venueId: venue.id
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
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({
		attendeeCount: session._count.attendees,
		roleMembers: session.attendees.map((sessionAttendee) => {
			const { attendee } = sessionAttendee;

			return {
				...sessionAttendee,
				attendee: stripAttendeeWithUserPassword(attendee)
			};
		}),
		...session
	}));
};

export const getSessionsByDate = async (
	eid: string,
	date: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const dateParsed = parseISO(String(date));
	const dateParsedStart = zonedTimeToUtc(startOfDay(dateParsed), event.timeZone);
	const dateParsedEnd = zonedTimeToUtc(endOfDay(dateParsed), event.timeZone);

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			OR: [
				{
					startDate: {
						gte: dateParsedStart,
						lte: dateParsedEnd
					}
				},
				{
					endDate: {
						gte: dateParsedStart,
						lte: dateParsedEnd
					}
				},
				{
					AND: {
						startDate: { lte: dateParsedStart },
						endDate: { gte: dateParsedEnd }
					}
				}
			]
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
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({
		attendeeCount: session._count.attendees,
		roleMembers: session.attendees.map((sessionAttendee) => {
			const { attendee } = sessionAttendee;

			return {
				...sessionAttendee,
				attendee: stripAttendeeWithUserPassword(attendee)
			};
		}),
		...session
	}));
};

export const getSessionsByCategory = async (
	eid: string,
	cid: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const type = await getSessionCategory(eid, cid);

	if (!type) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			categoryId: type.id
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
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({
		attendeeCount: session._count.attendees,
		roleMembers: session.attendees.map((sessionAttendee) => {
			const { attendee } = sessionAttendee;

			return {
				...sessionAttendee,
				attendee: stripAttendeeWithUserPassword(attendee)
			};
		}),
		...session
	}));
};
