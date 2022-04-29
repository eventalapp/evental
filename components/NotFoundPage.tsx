import Head from 'next/head';
import { Navigation } from './navigation';
import Column from './layout/Column';
import { NotFound } from './NotFound';
import PageWrapper from './layout/PageWrapper';
import React from 'react';

export const NotFoundPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Not Found</title>
		</Head>

		<Navigation />

		<Column>
			<NotFound />
		</Column>
	</PageWrapper>
);
