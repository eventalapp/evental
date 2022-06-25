import classNames from 'classnames';
import React from 'react';

const variants = {
	primary: 'flex flex-row justify-between items-center flex-wrap mb-3',
	start: 'flex flex-row justify-between items-start flex-wrap mb-3',
	noWrap: 'flex flex-row justify-between items-center mb-3',
	noWrapStart: 'flex flex-row justify-between items-start mb-3'
};

type Props = {
	children?: React.ReactNode;
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const FlexRowBetween: React.FC<Props> = (props) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<div className={classNames(variants[variant], className)} {...rest}>
			{children}
		</div>
	);
};
