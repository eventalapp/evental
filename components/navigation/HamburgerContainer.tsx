import classNames from 'classnames';
import React from 'react';

type HamburgerContainerProps = { className?: string };

export const HamburgerContainer: React.FC<HamburgerContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div className={classNames('flex flex-row justify-end items-center lg:hidden', className)}>
			{children}
		</div>
	);
};
