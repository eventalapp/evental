import type { NextPage } from 'next';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { NextSeo } from 'next-seo';

const ContactPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Contact — Evental"
				description="Contact our team for support. We are here to help you with any questions you may have."
				openGraph={{
					url: 'https://evental.app/contact',
					title: 'Contact — Evental',
					description:
						'Contact our team for support. We are here to help you with any questions you may have.',
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
				<h1 className="text-2xl md:text-3xl font-bold">Contact</h1>
			</Column>
		</PageWrapper>
	);
};

export default ContactPage;
