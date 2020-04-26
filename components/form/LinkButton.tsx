import classNames from 'classnames';
import React from 'react';

type Props = {
	children?: React.ReactNode;
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

const variants = {
	primary:
		'bg-secondary-600 px-4 py-1.5 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-base',
	secondary:
		'bg-gray-200 px-3 py-1.5 text-black disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-base',
	gradient:
		'px-4 py-1.5 text-white disabled:cursor-not-allowed inline-block rounded-md disabled:opacity-20 pointer text-base font-bold bg-gradient-to-r from-primary-500 to-secondary-500'
};

type LinkButtonProps = Props &
	React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>((props, ref) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<a className={classNames(variants[variant], className)} ref={ref} {...rest}>
			{children}
		</a>
	);
});
