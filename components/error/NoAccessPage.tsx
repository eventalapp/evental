import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import NoAccess from './NoAccess';

export const NoAccessPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>No Access</title>
		</Head>

		<Navigation />

		<Column>
			<NoAccess />
		</Column>
	</PageWrapper>
);
