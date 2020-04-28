import classNames from 'classnames';
import React from 'react';

const variants = {
	secondary:
		'w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary'
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
	const { className, children, variant = 'secondary', ...rest } = props;

	return (
		<input className={classNames(variants[variant], className)} ref={ref} {...rest}>
			{children}
		</input>
	);
});
