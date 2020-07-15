import classNames from 'classnames';
import React from 'react';

type LinkContainerProps = {
	className?: string;
};

export const LinkContainer: React.FC<LinkContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div
			className={classNames('col-span-5 hidden h-full flex-row justify-center lg:flex', className)}
		>
			{children}
		</div>
	);
};
