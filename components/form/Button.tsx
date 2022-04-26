import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

const variants = {
	primary:
		'bg-gray-900 px-3 py-2 text-white font-semibold inline-block rounded-md disabled:cursor-not-allowed disabled:opacity-20 pointer',
	secondary:
		'bg-gray-200 px-3 py-1.5 text-black inline-block rounded-md text-base disabled:opacity-20 pointer',
	gradient:
		'bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-1.5 text-white inline-block rounded-md text-base font-bold disabled:cursor-not-allowed disabled:opacity-20 pointer'
};

type ButtonProps = Props &
	React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<button className={classNames(variants[variant], className)} {...rest}>
			{children}
		</button>
	);
};
