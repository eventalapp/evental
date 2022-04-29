import classNames from 'classnames';
import React from 'react';

const variants = {
	secondary:
		'w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary'
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, Props>((props, ref) => {
	const { className, children, variant = 'secondary', ...rest } = props;

	return (
		<select className={classNames(variants[variant], className)} ref={ref} {...rest}>
			{children}
		</select>
	);
});
