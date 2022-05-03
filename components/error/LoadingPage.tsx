import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import { Loading } from './Loading';

export const LoadingPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Loading</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<Loading />
		</Column>
	</PageWrapper>
);
