import classNames from 'classnames';
import React from 'react';

import { paddings, variants } from './Button';

type Props = {
	children?: React.ReactNode;
	className?: string;
	variant?: keyof typeof variants;
	padding?: keyof typeof paddings;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export const LinkButton = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
	const { className, children, padding = 'small', variant = 'default', ...rest } = props;

	return (
		<a
			className={classNames(
				'inline-flex cursor-pointer select-none select-none items-center justify-center rounded-md text-sm font-medium transition duration-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 disabled:cursor-not-allowed disabled:opacity-50',
				paddings[padding],
				variants[variant],
				className
			)}
			ref={ref}
			{...rest}
		>
			{children}
		</a>
	);
});
