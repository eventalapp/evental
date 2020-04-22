import { ServerErrorPayload } from '../typings/error';
import React from 'react';

interface Props {
	error: ServerErrorPayload;
}

export const ServerError: React.FC<Props> = (props) => {
	const { error } = props;

	return (
		<div>
			<h1 className="text-3xl mb-2">Error</h1>
			<p className="text-red-700">{error.message}</p>
		</div>
	);
};
