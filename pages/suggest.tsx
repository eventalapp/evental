import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import Column from '../components/layout/Column';
import { Footer } from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/primitives/Heading';

const SuggestPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Suggest a feature — Evental"
				description="Suggest a feature that you would like to see implemented in evental.app"
				openGraph={{
					url: 'https://evental.app/suggest',
					title: 'Suggest a feature — Evental',
					description: 'Suggest a feature that you would like to see implemented in evental.app',
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
				<Heading>Suggest a feature</Heading>
				<iframe
					title="Suggest a feature"
					src="https://docs.google.com/forms/d/e/1FAIpQLSeXAr_Ij5eiYzGPl9v_rKVJgkoZq6m6jvLDStGoiq4SQGnSLQ/viewform?embedded=true"
					className="block h-full min-h-[80vh] w-full outline-none"
				>
					Loading…
				</iframe>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SuggestPage;
