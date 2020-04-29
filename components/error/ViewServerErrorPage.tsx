import { ServerErrorPayload } from '../../typings/error';
import React from 'react';
import PageWrapper from '../layout/PageWrapper';

type Props = {
	errors: Array<ServerErrorPayload | null>;
};

export const ViewServerErrorPage: React.FC<Props> = (props) => {
	const { errors } = props;

	if (!errors) {
		return null;
	}

	return (
		<PageWrapper>
			<h1 className="text-3xl mb-2">Error</h1>
			<ul>
				{errors
					.filter((error) => error)
					.map((error, i) => (
						<li key={i} className="text-red-700">
							{error!.message}
						</li>
					))}
			</ul>
		</PageWrapper>
	);
};
