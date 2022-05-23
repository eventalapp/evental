import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { LinkButton } from '../form/LinkButton';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';

export const PrivatePage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Private</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<h1 className="text-2xl md:text-3xl mb-2 font-bold">Private Event</h1>
			<span className="mb-2 block">This event is private. Please check back later</span>
			<span className="mb-5 block text-gray-500 text-center">
				If you believe you should be able to see this page, please contact the event owner and ask
				them make you an organizer.
			</span>
			<Link href={`/events`} passHref>
				<LinkButton padding="large">View Events</LinkButton>
			</Link>
		</Column>
	</PageWrapper>
);
