import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import { NotFound } from './NotFound';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';

export const NotFoundPage: React.FC<{ message?: string; renderLink?: boolean }> = (props) => {
	const { message = 'Not found.', renderLink = true } = props;

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth" className="flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold">Not Found</h1>
				<NotFound message={message} />
				{renderLink && (
					<Link href="/events" passHref>
						<LinkButton>Go to events</LinkButton>
					</Link>
				)}
			</Column>
		</PageWrapper>
	);
};
