import dayjs from 'dayjs';

type FormatDateRangeArgs = {
	showHour?: boolean;
};

export const formatDateRange = (start: Date, end: Date, args: FormatDateRangeArgs = {}) => {
	const { showHour = true } = args;

	const startDate = dayjs(start);
	const endDate = dayjs(end);

	if (startDate.day() === endDate.day() && startDate.month() === endDate.month()) {
		return `${dayjs(startDate).format('MMM D')}${
			showHour ? dayjs(startDate).format(', h:mm a') : ''
		} ${showHour ? dayjs(endDate).format('- h:mm a') : ''}`;
	}

	if (startDate.month() !== endDate.month()) {
		return `${dayjs(startDate).format('MMM D')}${
			showHour ? dayjs(startDate).format(', h:mm a') : ''
		} ${dayjs(endDate).format('- MMM Do')}${showHour ? dayjs(endDate).format(', h:mm a') : ''}`;
	}

	if (startDate.month() === endDate.month()) {
		return `${dayjs(startDate).format('MMM D')}${
			showHour ? dayjs(startDate).format(', h:mm a') : ''
		} ${dayjs(endDate).format('- Do')}${showHour ? dayjs(endDate).format(', h:mm a') : ''}`;
	}

	return `${dayjs(startDate).format('MMM Do')}${
		showHour ? dayjs(startDate).format(', h:mm a') : ''
	} - ${dayjs(endDate).format('MMM Do')}${showHour ? dayjs(endDate).format(', h:mm a') : ''}`;
};
