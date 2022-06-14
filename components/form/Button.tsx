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
		'bg-primary-500 hover:bg-primary-400 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer select-none',
	'danger':
		'bg-red-500 hover:bg-red-400 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer select-none',
	'secondary':
		'bg-secondary-500 hover:bg-secondary-400 border-2 border-secondary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer select-none',
	'gradient':
		'bg-gradient-to-r from-secondary-500 to-primary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer select-none',
	'no-bg':
		'text-gray-600 hover:text-gray-500 disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center select-none',
	'inversePrimary':
		'bg-white hover:bg-gray-75 border-2 border-primary-500 text-primary disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-50 pointer text-sm font-medium transition text-center cursor-pointer select-none',
	'default':
		'border inline-flex select-none items-center justify-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 focus-visible:ring-primary-500 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900 cursor-pointer'
};

export const paddings = {
	tiny: 'px-3 py-1',
	small: 'px-4 py-2',
	medium: 'px-6 py-2',
	large: 'px-4 py-2 md:px-8',
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
