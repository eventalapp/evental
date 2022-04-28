import React from 'react';
import classNames from 'classnames';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

type LayoutProps = Props &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const variants = {
	padding: 'w-11/12 lg:max-w-6xl md:w-4/6 sm:w-5/6 m-auto py-6 md:py-10',
	noPadding: 'w-11/12 lg:max-w-6xl md:w-4/6 sm:w-5/6 m-auto'
};

const Column: React.FC<LayoutProps> = (props) => {
	const { children, className, variant = 'padding', ...rest } = props;

	return (
		<div className={classNames(variants[variant], className)} {...rest}>
			{children}
		</div>
	);
};

export default Column;
