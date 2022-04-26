import React from 'react';
import classNames from 'classnames';

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
				'cursor-pointer block py-1 px-5 rounded hover:bg-gray-200 outline-none no-underline',
				className
			)}
			ref={ref}
			{...rest}
		>
			{children}
		</a>
	);
});
