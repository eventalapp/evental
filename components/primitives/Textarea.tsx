import classNames from 'classnames';
import React from 'react';

import { theme } from '../../tailwind.config';

const variants = {
	default:
		'transition duration-75 w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 focus:border-gray-300 min-h-[100px]'
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	color?: string;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
	const { className, children, variant = 'default', color, ...rest } = props;

	return (
		<textarea
			className={classNames(variants[variant], className)}
			style={{
				// @ts-ignore
				'--tw-ring-color': color ?? theme.extend.colors.gray[700]
			}}
			ref={ref}
			{...rest}
		>
			{children}
		</textarea>
	);
});
