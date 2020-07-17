import classNames from 'classnames';
import React from 'react';

type HamburgerContainerProps = { className?: string };

export const HamburgerContainer: React.FC<HamburgerContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div className={classNames('flex flex-row items-center justify-end lg:hidden', className)}>
			{children}
		</div>
	);
};
