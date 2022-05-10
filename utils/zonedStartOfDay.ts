import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { startOfDay } from 'date-fns';

export const zonedStartOfDay = (date: Date, timeZone: string): Date => {
	const inputZoned = utcToZonedTime(startOfDay(date), timeZone);

	const dayStartZoned = startOfDay(inputZoned);

	return zonedTimeToUtc(dayStartZoned, timeZone, { timeZone });
};
