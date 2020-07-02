import classNames from 'classnames';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { theme } from '../../tailwind.config';

interface Props {
	children?: React.ReactNode;
	className?: string;
	[x: string]: unknown;
}

export const sidebarSkeleton = (
	<div className="py-1 px-2.5 mt-1">
		<Skeleton
			className="w-full h-5 rounded-md"
			baseColor={theme.extend.colors.gray[200]}
			highlightColor={theme.extend.colors.gray[100]}
		/>
	</div>
);

export const SidebarLink = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
	const { className, children, ...rest } = props;

	return (
		<a
			className={classNames(
				'cursor-pointer block py-1 px-2.5 rounded hover:bg-gray-200 outline-none no-underline mt-1',
				className
			)}
			ref={ref}
			{...rest}
		>
			{children}
		</a>
	);
});
