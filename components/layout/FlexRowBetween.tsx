import classNames from 'classnames';
import React from 'react';

const variants = {
	secondary: 'flex flex-row justify-between items-center flex-wrap mb-3'
};

type Props = {
	children?: React.ReactNode;
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const FlexRowBetween: React.FC<Props> = (props) => {
	const { className, children, variant = 'secondary', ...rest } = props;

	return (
		<div className={classNames(variants[variant], className)} {...rest}>
			{children}
		</div>
	);
};
