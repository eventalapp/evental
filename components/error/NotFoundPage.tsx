import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../Footer';
import { LinkButton } from '../form/LinkButton';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { NotFound } from './NotFound';

export const NotFoundPage: React.FC<{ message?: string; renderLink?: boolean }> = (props) => {
	const { message = 'Not found.', renderLink = true } = props;

	return (
		<PageWrapper>
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth" className="flex flex-col items-center justify-center">
				<h1 className="text-2xl font-bold md:text-3xl">Not Found</h1>
				<NotFound message={message} className="my-3" />
				{renderLink && (
					<Link href="/events" passHref>
						<LinkButton>Go to events</LinkButton>
					</Link>
				)}
			</Column>

			<Footer />
		</PageWrapper>
	);
};
