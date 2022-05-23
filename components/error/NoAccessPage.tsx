import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import NoAccess from './NoAccess';
import { Footer } from '../Footer';

export const NoAccessPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>No Access</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<NoAccess />
		</Column>

		<Footer />
	</PageWrapper>
);
