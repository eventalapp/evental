import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import Column from '../layout/Column';
import { Footer } from '../layout/Footer';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import { Heading } from '../primitives/Heading';
import { LinkButton } from '../primitives/LinkButton';

export const AlreadySignedInPage = () => (
	<PageWrapper>
		<Head>
			<title>Already Signed In</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<div className="mb-3 flex flex-row justify-between">
				<Heading>Sign in</Heading>
			</div>
			<p>You are already signed in.</p>
			<Link href="/" passHref>
				<LinkButton className="mt-3" variant="primary">
					Return home
				</LinkButton>
			</Link>
		</Column>

		<Footer />
	</PageWrapper>
);
