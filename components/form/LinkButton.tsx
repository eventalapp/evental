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
	const { className, children, padding = 'small', variant = 'primary', ...rest } = props;

	return (
		<a className={classNames(paddings[padding], variants[variant], className)} ref={ref} {...rest}>
			{children}
		</a>
	);
});
