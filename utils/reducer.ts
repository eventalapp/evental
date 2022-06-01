import dayjs from 'dayjs';

import { SessionWithVenue } from '../pages/api/events/[eid]/sessions';
import { SessionWithVenueEvent } from '../pages/api/users/[uid]/sessions';
import { AttendeeWithUser } from './stripUserPassword';

export const sessionListReducer = (
	acc: Record<string, Record<string, SessionWithVenue[]>>,
	session: SessionWithVenue
) => {
	const day = dayjs(session.startDate).format('YYYY/MM/DD');
	const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

	if (!acc[day]) {
		acc[day] = {};
	}

	if (!acc[day][hour]) {
		acc[day][hour] = [];
	}

	acc[day][hour].push(session);

	return acc;
};

export const sessionWithEventListReducer = (
	acc: Record<string, Record<string, SessionWithVenueEvent[]>>,
	session: SessionWithVenueEvent
) => {
	const day = dayjs(session.startDate).format('YYYY/MM/DD');
	const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

	if (!acc[day]) {
		acc[day] = {};
	}

	if (!acc[day][hour]) {
		acc[day][hour] = [];
	}

	acc[day][hour].push(session);

	return acc;
};

export const sessionAttendeeReducer = (
	acc: Record<string, AttendeeWithUser[]>,
	attendee: AttendeeWithUser
) => {
	if (!acc[attendee.role.name]) {
		acc[attendee.role.name] = [];
	}
	acc[attendee.role.name].push(attendee);
	return acc;
};
