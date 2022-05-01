import React from 'react';

export const NotFound: React.FC<{ message?: string }> = (props) => {
	const { message = 'Not found.' } = props;

	return (
		<div>
			<p className="my-3">{message}</p>
		</div>
	);
};