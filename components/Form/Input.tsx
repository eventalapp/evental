import classNames from 'classnames';
import React from 'react';

interface Props {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
}

const variants = {
	primary: 'border-b-2 border-gray-200 placeholder-gray-400 text-md my-2 py-1 px-2 w-full'
};

type InputProps = Props &
	React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<input className={classNames(variants[variant], className)} {...rest}>
			{children}
		</input>
	);
};
