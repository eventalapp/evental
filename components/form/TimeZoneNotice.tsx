import { formatInTimeZone } from 'date-fns-tz';
import React from 'react';

export const TimeZoneNotice: React.FC<{ date: Date; timeZone: string }> = (props) => {
	const { date, timeZone } = props;

	return Intl.DateTimeFormat().resolvedOptions().timeZone !== timeZone ? (
		<em className="mt-1 block text-sm text-gray-500">
			The true date will be {formatInTimeZone(date, timeZone, 'MM/dd/yyyy h:mm a')} in the events
			timezone.
		</em>
	) : null;
};
