import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';

export const PrivatePage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Private</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<h1 className="text-2xl md:text-3xl mb-2 font-bold">Private</h1>
			<span className="mb-5 block">This event is private.</span>
			<Link href={`/events`} passHref>
				<LinkButton padding="large">View Events</LinkButton>
			</Link>
		</Column>
	</PageWrapper>
);
