import { format } from 'date-fns';
import React, { forwardRef } from 'react';

export const DatePickerButton = forwardRef<
	HTMLButtonElement,
	{ value: Date | null | undefined; formatTime?: string; onClick?: () => void }
>(({ value, formatTime = 'MM/dd/yyyy', onClick }, ref) => {
	return (
		<button
			onClick={onClick}
			ref={ref}
			type="button"
			className="inline-flex w-full justify-start rounded border border-gray-300 bg-white py-2 px-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
		>
			{value && format(new Date(value), formatTime)}
		</button>
	);
});
