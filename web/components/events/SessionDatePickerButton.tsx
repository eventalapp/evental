import React, { forwardRef } from 'react';

import { formatDateRange } from '@eventalapp/shared/utils';

import Tooltip from '../primitives/Tooltip';

export const SessionDatePickerButton = forwardRef<
	HTMLButtonElement,
	{ startDate: Date | null | undefined; endDate: Date | null | undefined; onClick?: () => void }
>(({ startDate, endDate, onClick }, ref) => {
	if (!startDate || !endDate) {
		return null;
	}

	return (
		<Tooltip message={`Click to view all sessions occurring on a date`} side="left">
			<button onClick={onClick} ref={ref} type="button" className="text-left text-gray-600">
				{formatDateRange(startDate, endDate, { showHour: false })}
			</button>
		</Tooltip>
	);
});
