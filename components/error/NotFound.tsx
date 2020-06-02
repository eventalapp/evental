import classNames from 'classnames';
import React from 'react';

export const NotFound: React.FC<{ message?: string; className?: string }> = (props) => {
	const { message = 'Not found.', className } = props;

	return <p className={classNames('text-gray-600', className)}>{message}</p>;
};
