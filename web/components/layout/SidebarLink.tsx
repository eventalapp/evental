import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { theme } from '../../tailwind.config';

interface Props {
	children?: React.ReactNode;
	className?: string;
	href?: string;
	[x: string]: unknown;
}

export const sidebarSkeleton = (
	<div className="mt-1 py-1 px-2.5">
		<Skeleton
			className="h-5 w-full rounded-md"
			baseColor={theme.extend.colors.gray[200]}
			highlightColor={theme.extend.colors.gray[100]}
		/>
	</div>
);

export const SidebarLink = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
	const router = useRouter();
	const { className, children, href, ...rest } = props;

	if (href) {
		return (
			<Link href={href} passHref>
				<a
					className={classNames(
						'mt-1 block cursor-pointer rounded py-1 px-2.5 text-gray-600 no-underline outline-none transition-all duration-75 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75',
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
	}

	return (
		<a
			className={classNames(
				'mt-1 block cursor-pointer rounded py-1 px-2.5 text-gray-600 no-underline outline-none transition-all duration-75 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-900 focus-visible:ring-opacity-75',
				className
			)}
			ref={ref}
			{...rest}
		>
			{children}
		</a>
	);
});
