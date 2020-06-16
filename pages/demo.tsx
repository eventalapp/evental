import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../components/Footer';
import { SubmitDemoRequestForm } from '../components/contact/SubmitDemoRequestForm';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';

const DemoPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Request Demo — Evental"
				description={`Fill out the form below to submit a demo request.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Request Demo — Evental',
					description: `Fill out the form below to submit a demo request.`,
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

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<h1 className="text-2xl font-bold md:text-3xl">Create a Demo Request</h1>
					<p className="mt-4 text-base text-gray-100">
						Fill out the form below to submit a demo request.
					</p>
				</Column>
			</div>

			<Column variant="halfWidth">
				<SubmitDemoRequestForm />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default DemoPage;
