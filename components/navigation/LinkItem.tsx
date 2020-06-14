import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export const LinkItem: React.FC<{ link: string; label: string }> = (props) => {
	const { link, label } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<NavigationMenuPrimitive.Link
				className={classNames(
					'cursor-pointer pb-1.5 border-b-2',
					router.asPath == link ? 'border-primary' : 'border-transparent'
				)}
			>
				<NavigationMenuPrimitive.Item
					className={classNames(
						'px-3 py-1.5 text-sm rounded-md hover:bg-gray-75 dark:hover:bg-gray-900',
						'text-sm font-medium dark:text-gray-75 font-medium',
						router.asPath == link ? 'text-primary' : 'text-gray-900'
					)}
				>
					{label}
				</NavigationMenuPrimitive.Item>
			</NavigationMenuPrimitive.Link>
		</Link>
	);
};
