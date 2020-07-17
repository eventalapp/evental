import classNames from 'classnames';
import React from 'react';

type AuthContainerProps = {
	className?: string;
};

export const AuthContainer: React.FC<AuthContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div className={classNames('col-span-2 hidden h-full flex-row justify-end lg:flex', className)}>
			{children}
		</div>
	);
};
