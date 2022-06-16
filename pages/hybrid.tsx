import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../components/Footer';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';

const PricingPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Hybrid — Evental"
				description={`See why Evental is perfect for your next hybrid event.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Hybrid — Evental',
					description: `See why Evental is perfect for your next hybrid event.`,
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>
			<Navigation />

			<Column className="flex flex-col items-center">
				<h1 className="text-2xl font-bold md:text-3xl">Hybrid Events with Evental</h1>
				<p className="mt-4 text-base text-gray-600">
					See why Evental is perfect for your next hybrid event.
				</p>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default PricingPage;
