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
				title="Conference — Evental"
				description={`See why Evental is perfect for your next conference event.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Conference — Evental',
					description: `See why Evental is perfect for your next conference event.`,
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
				<h1 className="text-2xl font-bold md:text-3xl">Conference Events with Evental</h1>
				<p className="text-md mt-4 text-gray-600">
					See why Evental is perfect for your next conference event.
				</p>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default PricingPage;
