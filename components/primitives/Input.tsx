import classNames from 'classnames';
import React from 'react';

import { theme } from '../../tailwind.config';

const variants = {
	default: 'text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 '
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	color?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { className, children, variant = 'default', color, onChange, ...rest } = props;

	return (
		<input
			className={classNames(
				'w-full px-3 py-2 text-sm font-medium transition duration-75 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:cursor-not-allowed disabled:text-gray-400',
				variants[variant],
				className
			)}
			ref={ref}
			onChange={onChange}
			style={{
				// @ts-ignore
				'--tw-ring-color': color ?? theme.extend.colors.gray[700]
			}}
			{...rest}
		>
			{children}
		</input>
	);
});
