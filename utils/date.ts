import { addDays } from 'date-fns';

export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
	let dates: Date[] = [];
	let currentDate = startDate;

	while (currentDate <= endDate) {
		dates.push(currentDate);
		currentDate = addDays(currentDate, 1);
	}

	return dates;
};
