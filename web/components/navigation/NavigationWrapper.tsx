import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
};

export const NavigationWrapper: React.FC<Props> = (props) => {
	const { className, children, ...restProps } = props;

	return (
		<nav {...restProps} className="border-b border-gray-200 bg-white shadow-sm">
			<div
				className={classNames(
					'm-auto flex h-14 w-full max-w-7xl flex-row items-center justify-between px-3',
					className
				)}
			>
				{children}
			</div>
		</nav>
	);
};
