import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { LinkButton } from '../primitives/LinkButton';

export const PrivatePage = () => (
	<PageWrapper>
		<Head>
			<title>Private</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<h1 className="mb-2 text-2xl font-bold md:text-3xl">Private Event</h1>
			<span className="mb-2 block">This event is private. Please check back later</span>
			<span className="mb-5 block text-center text-gray-500">
				If you believe you should be able to see this page, please contact the event owner and ask
				them make you an organizer.
			</span>
			<Link href={`/events`} passHref>
				<LinkButton padding="large" variant="primary">
					View Events
				</LinkButton>
			</Link>
		</Column>
	</PageWrapper>
);
