import React, { forwardRef } from 'react';

import { theme } from '../../tailwind.config';

export const DatePickerButton = forwardRef<
	HTMLButtonElement,
	{ children?: React.ReactNode; onClick?: () => void; color?: string }
>(({ children, onClick, color }, ref) => {
	return (
		<button
			onClick={onClick}
			ref={ref}
			type="button"
			className="inline-flex w-full justify-start rounded border border-gray-300 bg-white py-2 px-3 text-base font-medium text-gray-700 shadow-sm transition duration-75 hover:bg-gray-50 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0"
			style={{
				// @ts-ignore
				'--tw-ring-color': color ?? theme.extend.colors.gray[700]
			}}
		>
			{children}
		</button>
	);
});
