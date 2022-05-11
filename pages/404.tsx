import { NextPage } from 'next';
import Link from 'next/link';
import Column from '../components/layout/Column';
import { LinkButton } from '../components/form/LinkButton';
import { Navigation } from '../components/navigation';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { NextSeo } from 'next-seo';

const ErrorNotFoundPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Page Not Found"
				description="This page has not been found. Please check the URL and try again."
			/>

			<Navigation />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold">404 - Page not found</h1>

				<Link href="/events" passHref>
					<LinkButton className="mt-5" variant="primary">
						Go home
						<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
					</LinkButton>
				</Link>
			</Column>
		</PageWrapper>
	);
};

export default ErrorNotFoundPage;
