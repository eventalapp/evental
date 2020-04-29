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
		'bg-primary-500 hover:bg-primary-400 border-2 border-primary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold transition text-center',
	'secondary':
		'bg-secondary-500 hover:bg-secondary-400 border-2 border-secondary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold transition text-center',
	'gradient':
		'bg-gradient-to-r from-secondary-500 to-primary-500 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold transition text-centerr',
	'no-bg':
		'text-gray-900 disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold transition text-center',
	'inversePrimary':
		'bg-white hover:bg-gray-100 border-2 border-primary-500 text-primary disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-sm font-semibold transition text-center'
};

export const paddings = {
	tiny: 'px-1.5 py-1',
	small: 'px-3 py-2',
	medium: 'px-6 py-2',
	large: 'px-8 py-2',
	none: 'p-0'
};

export const Button: React.FC<Props> = (props) => {
	const { className, children, variant = 'secondary', padding = 'small', ...rest } = props;

	return (
		<button className={classNames(paddings[padding], variants[variant], className)} {...rest}>
			{children}
		</button>
	);
};
