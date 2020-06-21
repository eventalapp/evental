import cx from 'classnames';
import React from 'react';

import { theme } from '../../../../tailwind.config';

export const variants = {
	primary:
		'duration-50 transition focus-visible:ring-primary-500 bg-primary text-white hover:bg-primary-400',
	danger: 'duration-50 transition bg-red-500 text-white',
	secondary: 'duration-50 transition bg-secondary-500 text-white',
	gradient: 'duration-50 transition bg-gradient-to-r from-secondary-500 to-primary-500 text-white',
	default:
		'duration-50 transition focus-visible:ring-primary-500 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900'
};

export const paddings = {
	tiny: 'px-2 py-2',
	small: 'px-3 py-2',
	medium: 'px-4 py-2',
	large: 'px-6 py-2',
	none: 'p-0'
};

type Props = React.ComponentProps<'button'> & {
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
	ringColor?: string;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
	(
		{ style, ringColor, children, className, variant = 'default', padding = 'medium', ...props },
		ref
	) => (
		<button
			ref={ref}
			{...props}
			className={cx(
				'inline-flex select-none items-center justify-center rounded-md border text-sm font-medium',
				'duration-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring focus-visible:ring-opacity-75',
				// Register all radix states
				'group',
				'radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900',
				'radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900',
				'radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50',
				paddings[padding],
				variants[variant],
				className
			)}
			style={{
				...style,
				// @ts-ignore
				'--tw-ring-color': ringColor ?? theme.extend.colors.primary.DEFAULT
			}}
		>
			{children}
		</button>
	)
);

Button.displayName = 'Button';
export default Button;
