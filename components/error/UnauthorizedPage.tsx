import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import Unauthorized from './Unauthorized';
import { Footer } from '../Footer';

export const UnauthorizedPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Unauthorized</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<Unauthorized />
		</Column>

		<Footer />
	</PageWrapper>
);
