import type { NextPage } from 'next';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { NextSeo } from 'next-seo';

const SuggestPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
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
				<h1 className="text-2xl md:text-3xl font-bold mb-2">Suggest a feature</h1>
				<iframe
					title="Suggest a feature"
					src="https://docs.google.com/forms/d/e/1FAIpQLSeXAr_Ij5eiYzGPl9v_rKVJgkoZq6m6jvLDStGoiq4SQGnSLQ/viewform?embedded=true"
					className="w-full outline-none block h-full min-h-[800px]"
					frameBorder="0"
					marginHeight={0}
					marginWidth={0}
				>
					Loading…
				</iframe>
			</Column>
		</PageWrapper>
	);
};

export default SuggestPage;
