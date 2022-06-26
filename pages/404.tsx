import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import router from 'next/router';
import React from 'react';

import { Footer } from '../components/Footer';
import { Button } from '../components/form/Button';
import { LinkButton } from '../components/form/LinkButton';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/typography/Heading';

const ErrorNotFoundPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Page Not Found — Evental"
				description="This page has not been found. Please check the URL and try again."
			/>

			<Navigation />

			<Column>
				<div className="flex flex-col items-center">
					<Heading>Page not found</Heading>
					<p className="my-5 text-gray-600">We could not find the page you were looking for...</p>
					<div className="flex flex-row space-x-4">
						<Button type="button" variant="primary" onClick={router.back}>
							Go Back
						</Button>
						<Link href="/" passHref>
							<LinkButton variant="default">Return home</LinkButton>
						</Link>
					</div>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default ErrorNotFoundPage;
