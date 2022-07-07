import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { theme } from '../../tailwind.config';

interface Props {
	children?: React.ReactNode;
	className?: string;
	href: string;
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
	const router = useRouter();
	const { className, children, href, ...rest } = props;

	return (
		<Link href={href} passHref>
			<a
				className={classNames(
					'cursor-pointer block py-1 px-2.5 rounded hover:bg-gray-200 focus:bg-gray-200 text-gray-600 outline-none no-underline mt-1 transition-all duration-75 focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75',
					className,
					router.asPath === href ? 'bg-gray-300' : ''
				)}
				ref={ref}
				{...rest}
			>
				{children}
			</a>
		</Link>
	);
});
