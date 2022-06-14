import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { theme } from '../../tailwind.config';

export const LinkItem: React.FC<{ link: string; label: string; color?: string }> = (props) => {
	const { link, label, color } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<NavigationMenuPrimitive.Link
				className={classNames('cursor-pointer pb-1.5 border-b-2')}
				style={{
					borderColor:
						router.asPath == link ? color ?? theme.extend.colors.primary.DEFAULT : 'transparent'
				}}
			>
				<NavigationMenuPrimitive.Item
					className={classNames(
						'px-3 py-1.5 text-sm rounded-md hover:bg-gray-75 dark:hover:bg-gray-900',
						'text-sm font-medium dark:text-gray-75'
					)}
					style={{
						color:
							router.asPath == link ? color ?? theme.extend.colors.primary.DEFAULT : 'text-gray-900'
					}}
				>
					{label}
				</NavigationMenuPrimitive.Item>
			</NavigationMenuPrimitive.Link>
		</Link>
	);
};