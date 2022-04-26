import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

const variants = {
	primary:
		'bg-gray-900 px-3 py-2 text-white disabled:cursor-not-allowed font-semibold inline-block rounded-md disabled:opacity-20 pointer',
	link: 'text-gray-900 disabled:cursor-not-allowed font-semibold inline-block disabled:opacity-20 pointer'
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
