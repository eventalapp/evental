import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../components/Footer';
import { SubmitSupportTicketForm } from '../components/contact/SubmitSupportTicketForm';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';

const SupportPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Support — Evental"
				description={`Fill out the form below to submit a support ticket.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Support — Evental',
					description: `Fill out the form below to submit a support ticket.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Create a Support Ticket</h1>
					<p className="text-gray-100 text-md mt-4">
						Fill out the form below to submit a support ticket.
					</p>
				</Column>
			</div>

			<Column className="flex flex-col items-center">
				<SubmitSupportTicketForm />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SupportPage;
