import dayjs from 'dayjs';

import { SessionWithVenue } from '../pages/api/events/[eid]/sessions';

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
