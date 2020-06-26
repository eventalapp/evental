import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../Footer';
import { LinkButton } from '../form/LinkButton';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { Heading } from '../typography/Heading';
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
				<Heading>Not Found</Heading>
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
