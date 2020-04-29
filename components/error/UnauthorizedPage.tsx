import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import Unauthorized from './Unauthorized';

export const UnauthorizedPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Unauthorized</title>
		</Head>

		<Navigation />

		<Column>
			<Unauthorized />
		</Column>
	</PageWrapper>
);
