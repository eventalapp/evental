import classNames from 'classnames';
import React from 'react';

type Props = {
	children?: React.ReactNode;
	href?: string;
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
	className?: string;
	[x: string]: unknown;
};

export const DropdownLink = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
	const { className, children, ...rest } = props;

	return (
		<a
			className={classNames(
				'block cursor-pointer rounded py-1 px-5 no-underline outline-none hover:bg-gray-100',
				className
			)}
			ref={ref}
			{...rest}
		>
			{children}
		</a>
	);
});
