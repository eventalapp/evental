import cx from 'classnames';
import React from 'react';

export const variants = {
	'primary': 'bg-primary text-white hover:bg-primary-400',
	'danger': 'bg-red-500 hover:bg-red-400 text-white',
	'secondary': 'bg-secondary-500 text-white',
	'gradient': 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white',
	'default': 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
	'no-bg': 'text-gray-600 hover:text-gray-500'
};

export const paddings = {
	tiny: 'px-3 py-1',
	small: 'px-3 py-2',
	medium: 'px-4 py-2',
	large: 'px-6 py-2',
	none: 'p-0'
};

type Props = React.ComponentProps<'button'> & {
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
	const { style, children, className, variant = 'default', padding = 'medium', ...rest } = props;

	return (
		<button
			ref={ref}
			className={cx(
				'group inline-flex select-none items-center justify-center rounded-md text-sm font-medium transition duration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-opacity-75 disabled:cursor-not-allowed disabled:opacity-50',
				paddings[padding],
				variants[variant],
				className
			)}
			style={style}
			{...rest}
		>
			{children}
		</button>
	);
});
