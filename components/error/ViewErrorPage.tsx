import Head from 'next/head';
import { ErroredAPIResponse } from 'nextkit';
import React from 'react';

import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';

type Props = {
	errors: Array<ErroredAPIResponse | null | undefined>;
};

export const ViewErrorPage: React.FC<Props> = (props) => {
	const { errors } = props;

	if (!errors) {
		return null;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="mb-2 text-2xl font-bold md:text-3xl">Error</h1>
				<ul>
					{errors
						.filter((error) => error)
						.map((error, i) => (
							<li key={i} className="text-red-700">
								{error!.message}
							</li>
						))}
				</ul>
			</Column>
		</PageWrapper>
	);
};
