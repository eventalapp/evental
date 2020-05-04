import classNames from 'classnames';
import React from 'react';

type Props = {
	className?: string;
};

export const NavigationWrapper: React.FC<Props> = (props) => {
	const { className, children, ...restProps } = props;

	return (
		<nav {...restProps} className="bg-white border-b border-gray-200 shadow-sm">
			<div
				className={classNames(
					'flex flex-row items-center justify-between w-full max-w-7xl m-auto h-14 px-3',
					className
				)}
			>
				{children}
			</div>
		</nav>
	);
};
