import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const variants = {
	'primary':
		'bg-primary text-white inline-block rounded-md disabled:cursor-not-allowed disabled:opacity-20 pointer text-sm font-semibold',
	'secondary':
		'bg-secondary text-white inline-block rounded-md disabled:cursor-not-allowed disabled:opacity-20 pointer text-sm font-semibold',
	'gradient':
		'bg-gradient-to-r from-primary-500 to-secondary-500 text-white inline-block rounded-md disabled:cursor-not-allowed disabled:opacity-20 pointer text-sm font-semibold',
	'no-bg':
		'text-gray-900 font-semibold inline-block rounded-md disabled:cursor-not-allowed disabled:opacity-20 pointer text-sm font-semibold'
};

const paddings = {
	tiny: 'px-1.5 py-1',
	small: 'px-3 py-2',
	medium: 'px-6 py-2',
	large: 'px-8 py-2',
	none: 'p-0'
};

export const Button: React.FC<Props> = (props) => {
	const { className, children, variant = 'primary', padding = 'small', ...rest } = props;

	return (
		<button className={classNames(paddings[padding], variants[variant], className)} {...rest}>
			{children}
		</button>
	);
};
