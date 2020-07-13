import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { Paragraph } from '../../components/primitives/Paragraph';

const NotificationsPage: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Notifications — Evental"
				description="Update your notification preferences"
				openGraph={{
					title: 'Notifications — Evental',
					description: 'Update your notification preferences',
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
					<Heading className="mb-3">Notifications Page</Heading>
					<Paragraph className="text-gray-600">Update your notification preferences</Paragraph>
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default NotificationsPage;
