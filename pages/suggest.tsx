import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../components/Footer';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';

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
				<h1 className="mb-2 text-2xl font-bold md:text-3xl">Suggest a feature</h1>
				<iframe
					title="Suggest a feature"
					src="https://docs.google.com/forms/d/e/1FAIpQLSeXAr_Ij5eiYzGPl9v_rKVJgkoZq6m6jvLDStGoiq4SQGnSLQ/viewform?embedded=true"
					className="block w-full h-full min-h-[80vh] outline-none"
					frameBorder="0"
					marginHeight={0}
					marginWidth={0}
				>
					Loading…
				</iframe>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SuggestPage;
