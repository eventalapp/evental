import { CalendarEvent } from 'calendar-link';
import React from 'react';

import { AddToCalendarDropdown } from './AddToCalendarDropdown';

type Props = {
	event: CalendarEvent;
};

export const AddToCalendar: React.FC<Props> = (props) => {
	const { event } = props;

	return <AddToCalendarDropdown event={event} />;
};
