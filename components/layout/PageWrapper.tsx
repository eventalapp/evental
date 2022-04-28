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
	white: 'bg-white pb-10',
	gray: 'bg-gray-100 pb-10'
};

const PageWrapper: React.FC<LayoutProps> = (props) => {
	const { children, className, variant = 'gray', ...rest } = props;

	return (
		<div className={classNames(variants[variant], className)} {...rest}>
			{children}
		</div>
	);
};

export default PageWrapper;
