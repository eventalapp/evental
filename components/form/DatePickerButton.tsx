import React, { forwardRef } from 'react';
import { format } from 'date-fns';

export const DatePickerButton = forwardRef<
	HTMLButtonElement,
	{ value?: Date; onClick?: () => void }
>(({ value, onClick }, ref) => (
	<button
		onClick={onClick}
		ref={ref}
		type="button"
		className="inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary"
	>
		{value && format(new Date(value), 'dd MMMM yyyy')}
	</button>
));
