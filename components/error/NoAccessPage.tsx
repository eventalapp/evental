import Head from 'next/head';
import React from 'react';

import { Footer } from '../Footer';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import NoAccess from './NoAccess';

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
