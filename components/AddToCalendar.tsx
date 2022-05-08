import React from 'react';
import { CalendarEvent } from 'calendar-link';
import { AddToCalendarDropdown } from './radix/components/AddToCalendarDropdown';

type Props = {
	event: CalendarEvent;
};

export const AddToCalendar: React.FC<Props> = (props) => {
	const { event } = props;

	return <AddToCalendarDropdown event={event} />;
};
