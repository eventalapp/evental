import classNames from 'classnames';
import React from 'react';

const variants = {
	sm: '',
	default: 'text-base',
	lg: 'text-base md:text-lg',
	xl: 'text-base md:text-lg lg:text-xl lg:leading-8'
};

type Props = { className?: string; variant?: keyof typeof variants };

export const Paragraph: React.FC<Props> = (props) => {
	const { children, className, variant = 'default' } = props;

	return <p className={classNames(variants[variant], className)}>{children}</p>;
};
