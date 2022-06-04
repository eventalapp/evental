import Head from 'next/head';
import React from 'react';

import { Footer } from '../Footer';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import Unauthorized from './Unauthorized';

export const UnauthorizedPage = () => (
	<PageWrapper>
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
