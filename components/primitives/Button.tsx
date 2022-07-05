import cx from 'classnames';
import React from 'react';

import { theme } from '../../tailwind.config';

export const variants = {
	'primary': 'focus:ring-primary-500 bg-primary text-white hover:bg-primary-400',
	'danger': 'bg-red-500 hover:bg-red-400 text-white',
	'secondary': 'bg-secondary-500 text-white',
	'gradient': 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white',
	'default':
		'focus:ring-primary-500 border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
	'no-bg': 'text-gray-600 hover:text-gray-500'
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

export const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
	const {
		style,
		ringColor,
		children,
		className,
		variant = 'default',
		padding = 'medium',
		...rest
	} = props;

	return (
		<button
			ref={ref}
			className={cx(
				'inline-flex select-none items-center justify-center rounded-md text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 duration-50 transition focus:outline-none focus:ring-2 focus:ring focus:ring-opacity-75 select-none group',
				paddings[padding],
				variants[variant],
				className
			)}
			style={{
				...style,
				// @ts-ignore
				'--tw-ring-color': ringColor ?? theme.extend.colors.primary.DEFAULT
			}}
			{...rest}
		>
			{children}
		</button>
	);
});
