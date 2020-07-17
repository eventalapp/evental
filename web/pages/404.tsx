import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import router from 'next/router';
import React from 'react';

import Column from '../components/layout/Column';
import { Footer } from '../components/layout/Footer';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Button } from '../components/primitives/Button';
import { Heading } from '../components/primitives/Heading';
import { LinkButton } from '../components/primitives/LinkButton';

const ErrorNotFoundPage: NextPage = () => {
	return (
		<>
			<NextSeo
				title="Page Not Found — Evental"
				description="This page has not been found. Please check the URL and try again."
			/>

			<Navigation />

			<PageWrapper>
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
			</PageWrapper>

			<Footer />
		</>
	);
};

export default ErrorNotFoundPage;
