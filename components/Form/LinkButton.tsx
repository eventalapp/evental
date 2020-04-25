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
		'bg-blue-900 px-3 py-2 text-white disabled:cursor-not-allowed inline-block rounded-lg disabled:opacity-20 pointer',
	secondary:
		'bg-blue-100 px-3 py-2 text-black disabled:cursor-not-allowed inline-block rounded-lg disabled:opacity-20 pointer'
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
