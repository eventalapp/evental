import classNames from 'classnames';
import React from 'react';

const variants = {
	'primary':
		'bg-secondary-600 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold',
	'secondary':
		'bg-gray-200 text-black disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold',
	'gradient':
		'bg-gradient-to-r from-primary-500 to-secondary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold',
	'no-bg':
		'text-gray-900 disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold'
};

const paddings = {
	small: ' px-2 py-2 md:px-3',
	medium: 'px-3 py-2 md:px-6',
	large: 'px-4 py-2 md:px-8',
	none: 'p-0'
};

type Props = {
	children?: React.ReactNode;
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export const LinkButton = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
	const { className, children, padding = 'small', variant = 'primary', ...rest } = props;

	return (
		<a className={classNames(paddings[padding], variants[variant], className)} ref={ref} {...rest}>
			{children}
		</a>
	);
});
