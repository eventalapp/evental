import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

type LayoutProps = Props &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const variants = {
	white: 'bg-white overflow-x-hidden'
};

const PageWrapper: React.FC<LayoutProps> = (props) => {
	const { children, className, variant = 'white', ...rest } = props;

	return (
		<div
			className={classNames(variants[variant], className)}
			style={{ minHeight: 'calc(100vh - 57px)' }}
			{...rest}
		>
			{children}
		</div>
	);
};

export default PageWrapper;
