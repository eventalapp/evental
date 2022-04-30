import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import { NotFound } from './NotFound';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';

export const NotFoundPage: React.FC<{ message?: string }> = (props) => {
	const { message = 'Not found.' } = props;

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column>
				<NotFound message={message} />
			</Column>
		</PageWrapper>
	);
};
