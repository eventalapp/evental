import { format } from 'date-fns';
import React, { forwardRef } from 'react';
import { theme } from '../../tailwind.config';

export const DatePickerButton = forwardRef<
	HTMLButtonElement,
	{ value: Date | null | undefined; formatTime?: string; onClick?: () => void; color?: string }
>(({ value, formatTime = 'MM/dd/yyyy', onClick, color }, ref) => {
	return (
		<button
			onClick={onClick}
			ref={ref}
			type="button"
			className="duration-50 inline-flex w-full justify-start rounded border border-gray-300 bg-white py-2 px-3 text-base font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
			style={{
				// @ts-ignore
				'--tw-ring-color': color ?? theme.extend.colors.primary.DEFAULT
			}}
		>
			{value && format(new Date(value), formatTime)}
		</button>
	);
});
