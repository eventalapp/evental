import classNames from 'classnames';
import React from 'react';

import { theme } from '../../tailwind.config';

const variants = {
	default:
		'transition duration-50 w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	color?: string;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { className, children, variant = 'default', color, ...rest } = props;

	return (
		<input
			className={classNames(variants[variant], className)}
			ref={ref}
			style={{
				// @ts-ignore
				'--tw-ring-color': color ?? theme.extend.colors.primary.DEFAULT
			}}
			{...rest}
		>
			{children}
		</input>
	);
});
