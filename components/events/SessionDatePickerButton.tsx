import dayjs from 'dayjs';
import React, { forwardRef } from 'react';

export const SessionDatePickerButton = forwardRef<
	HTMLButtonElement,
	{ startDate: Date | null | undefined; endDate: Date | null | undefined; onClick?: () => void }
>(({ startDate, endDate, onClick }, ref) => {
	return (
		<button onClick={onClick} ref={ref} type="button">
			{dayjs(startDate).format('MMMM D')} - {dayjs(endDate).format('MMMM D')}
		</button>
	);
});
