import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const variants = {
	'primary':
		'bg-primary-500 hover:bg-primary-400 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer',
	'danger':
		'bg-red-500 hover:bg-red-400 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer',
	'secondary':
		'bg-secondary-500 hover:bg-secondary-400 border-2 border-secondary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer',
	'gradient':
		'bg-gradient-to-r from-secondary-500 to-primary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer',
	'no-bg':
		'text-gray-600 hover:text-gray-500 disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center',
	'inversePrimary':
		'bg-white hover:bg-gray-75 border-2 border-primary-500 text-primary disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer'
};

export const paddings = {
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
