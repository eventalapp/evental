import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import { NotFound } from './NotFound';
import PageWrapper from '../layout/PageWrapper';
import React from 'react';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';

export const NotFoundPage: React.FC<{ message?: string }> = (props) => {
	const { message = 'Not found.' } = props;

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Not Found</h1>
				<NotFound message={message} />
				<Link href="/events">
					<LinkButton>Go to events</LinkButton>
				</Link>
			</Column>
		</PageWrapper>
	);
};
