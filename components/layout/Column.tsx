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
	padding:
		'w-11/12 lg:max-w-6xl md:w-4/6 sm:w-5/6 m-auto my-4 md:my-8 bg-white p-5 rounded-md min-h-[20rem]',
	noPadding: 'w-11/12 lg:max-w-6xl md:w-4/6 sm:w-5/6 m-auto bg-white p-5 rounded-md',
	halfWidth:
		'w-11/12 lg:max-w-4xl md:w-4/6 lg:w-1/2 2xl:w-4/12 sm:w-5/6 m-auto my-4 md:my-8 bg-white p-5 rounded-md min-h-[20rem]'
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
