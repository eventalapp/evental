import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const PricingPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<Head>
				<title>Pricing</title>
			</Head>

			<Navigation />

			<Column className="flex flex-col items-center">
				<h1 className="text-2xl md:text-3xl font-bold">Contact</h1>
			</Column>
		</PageWrapper>
	);
};

export default PricingPage;
