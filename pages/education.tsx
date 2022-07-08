import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import Column from '../components/layout/Column';
import { Footer } from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/primitives/Heading';

const PricingPage: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Education — Evental"
				description={`See why Evental is perfect for your next educational/academic event.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Education — Evental',
					description: `See why Evental is perfect for your next educational/academic event.`,
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
			<PageWrapper>
				<Column className="flex flex-col items-center">
					<Heading>Educational Events with Evental</Heading>
					<p className="mt-4 text-base text-gray-600">
						See why Evental is perfect for your next educational/academic event.
					</p>
				</Column>
			</PageWrapper>
			<Footer />
		</>
	);
};

export default PricingPage;
