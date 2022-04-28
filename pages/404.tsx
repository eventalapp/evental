import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../components/layout/Column';
import { LinkButton } from '../components/form/LinkButton';
import { Navigation } from '../components/navigation';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';

const NotFoundPage: NextPage = () => {
	return (
		<PageWrapper>
			<Head>
				<title>Page not found</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="font-bold text-3xl mt-5">404 - Page not found</h1>

				<Link href="/events" passHref>
					<LinkButton className="mt-5" variant="gradient">
						Go to events page
						<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
					</LinkButton>
				</Link>
			</Column>
		</PageWrapper>
	);
};

export default NotFoundPage;
