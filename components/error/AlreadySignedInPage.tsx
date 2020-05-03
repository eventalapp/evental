import PageWrapper from '../layout/PageWrapper';
import { Navigation } from '../navigation';
import Column from '../layout/Column';
import React from 'react';
import Head from 'next/head';
import { LinkButton } from '../form/LinkButton';
import Link from 'next/link';

export const AlreadySignedInPage = () => (
	<PageWrapper variant="gray">
		<Head>
			<title>Already Signed In</title>
		</Head>

		<Navigation />

		<Column variant="halfWidth" className="flex flex-col items-center justify-center">
			<div className="flex flex-row justify-between mb-3">
				<h1 className="text-3xl font-bold">Sign in</h1>
			</div>
			<p>You are already signed in.</p>
			<Link href="/" passHref>
				<LinkButton className="mt-3">Return home</LinkButton>
			</Link>
		</Column>
	</PageWrapper>
);
