import classNames from 'classnames';
import React from 'react';

type Props = { className?: string; level?: 1 | 2 | 3 | 5 | 6 };

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const Heading: React.FC<Props> = (props) => {
	const { children, className, level = 1 } = props;

	const Tag = `h${level}` as HeadingTag;

	return (
		<Tag
			className={classNames(
				'text-2xl font-bold leading-[1.2] tracking-tight md:text-3xl',
				className
			)}
		>
			{children}
		</Tag>
	);
};
