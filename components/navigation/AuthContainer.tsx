import classNames from 'classNames';
import React from 'react';

type AuthContainerProps = {
	className?: string;
};

export const AuthContainer: React.FC<AuthContainerProps> = (props) => {
	const { children, className } = props;

	return (
		<div className={classNames('hidden h-full flex-row justify-end lg:flex col-span-2', className)}>
			{children}
		</div>
	);
};
