import classNames from 'classNames';
import React from 'react';

type LinkContainerProps = {
	className?: string;
};

export const LinkContainer: React.FC<LinkContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div
			className={classNames('hidden h-full flex-row justify-center lg:flex col-span-5', className)}
		>
			{children}
		</div>
	);
};
