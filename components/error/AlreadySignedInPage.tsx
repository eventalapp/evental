import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../Footer';
import { LinkButton } from '../form/LinkButton';
import Column from '../layout/Column';
import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';

export const AlreadySignedInPage = () => (
	<PageWrapper>
		<Head>
			<title>Already Signed In</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<div className="mb-3 flex flex-row justify-between">
				<h1 className="text-2xl font-bold md:text-3xl">Sign in</h1>
			</div>
			<p>You are already signed in.</p>
			<Link href="/" passHref>
				<LinkButton className="mt-3">Return home</LinkButton>
			</Link>
		</Column>

		<Footer />
	</PageWrapper>
);
