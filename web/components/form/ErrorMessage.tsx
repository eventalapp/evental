import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const variants = {
	secondary: 'text-red-500 text-sm block mt-1'
};

export const ErrorMessage: React.FC<Props> = (props) => {
	const { className, children, variant = 'secondary', ...rest } = props;

	return (
		<span className={classNames(variants[variant], className)} {...rest}>
			{children}
		</span>
	);
};
