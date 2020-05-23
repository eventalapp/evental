import { startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const zonedStartOfDay = (date: Date, timeZone: string): Date => {
	const inputZoned = utcToZonedTime(startOfDay(date), timeZone);

	const dayStartZoned = startOfDay(inputZoned);

	return zonedTimeToUtc(dayStartZoned, timeZone, { timeZone });
};
