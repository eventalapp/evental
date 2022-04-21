import classNames from 'classnames';
import React from 'react';

interface Props {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
}

const variants = {
	primary:
		'bg-blue-900 px-3 py-2 text-white disabled:cursor-not-allowed font-semibold inline-block rounded-lg disabled:opacity-20 pointer'
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
