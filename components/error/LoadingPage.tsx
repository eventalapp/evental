import Head from 'next/head';
import React from 'react';
import { Footer } from '../Footer';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { Loading } from './Loading';

export const LoadingPage = () => (
	<PageWrapper>
		<Head>
			<title>Loading</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<Loading />
		</Column>

		<Footer />
	</PageWrapper>
);
