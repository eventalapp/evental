import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { endOfDay, startOfDay } from 'date-fns';

export const zonedEndOfDay = (date: Date, timeZone: string): Date => {
	const inputZoned = utcToZonedTime(startOfDay(date), timeZone);

	const dayStartZoned = endOfDay(inputZoned);

	return zonedTimeToUtc(dayStartZoned, timeZone, { timeZone });
};
