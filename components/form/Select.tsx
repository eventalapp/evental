import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

const variants = {
	secondary: 'bg-white border-b-2 border-gray-200 placeholder-gray-400 text-sm my-2 py-1 px-2 w-full'
};

type InputProps = Props &
	React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export const Select: React.FC<InputProps> = (props) => {
	const { className, children, variant = 'secondary', ...rest } = props;

	return (
		<select className={classNames(variants[variant], className)} {...rest}>
			{children}
		</select>
	);
};
