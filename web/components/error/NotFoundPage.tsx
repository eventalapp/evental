import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import Column from '../layout/Column';
import { Footer } from '../layout/Footer';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { Heading } from '../primitives/Heading';
import { LinkButton } from '../primitives/LinkButton';
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
						<LinkButton variant="primary">Go to events</LinkButton>
					</Link>
				)}
			</Column>

			<Footer />
		</PageWrapper>
	);
};
