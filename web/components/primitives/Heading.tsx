import classNames from 'classnames';
import React from 'react';

const variants = {
	'sm': 'text-sm font-bold leading-[1.2] tracking-tight md:text-base',
	'xl': 'text-xl font-bold leading-[1.2] tracking-tight md:text-2xl',
	'default': 'text-2xl font-bold leading-[1.2] tracking-tight md:text-3xl',
	'3xl': 'text-3xl font-black leading-tight tracking-tight sm:text-4xl',
	'4xl': 'text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl'
};

type Props = { className?: string; level?: 1 | 2 | 3 | 4 | 5 | 6; variant?: keyof typeof variants };

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const Heading: React.FC<Props> = (props) => {
	const { children, className, level = 1, variant = 'default' } = props;

	const Tag = `h${level}` as HeadingTag;

	return <Tag className={classNames(variants[variant], className)}>{children}</Tag>;
};
