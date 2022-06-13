import React, { forwardRef } from 'react';
import { formatDateRange } from '../../utils/formatDateRange';

export const SessionDatePickerButton = forwardRef<
	HTMLButtonElement,
	{ startDate: Date | null | undefined; endDate: Date | null | undefined; onClick?: () => void }
>(({ startDate, endDate, onClick }, ref) => {
	if (!startDate || !endDate) {
		return null;
	}

	return (
		<button onClick={onClick} ref={ref} type="button" className="text-gray-600">
			{formatDateRange(startDate, endDate, { showHour: false })}
		</button>
	);
});
