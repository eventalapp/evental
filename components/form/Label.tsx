import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
};

const variants = {
	primary: 'text-xs text-gray-700 text-left block mb-1'
};

type LabelProps = Props &
	React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;

export const Label: React.FC<LabelProps> = (props) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<label className={classNames(variants[variant], className)} {...rest}>
			{children}
		</label>
	);
};
