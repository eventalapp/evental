import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { useUser } from '@eventalapp/shared/hooks';

import { RequestPasswordResetForm } from '../../../components/authentication/RequestPasswordResetForm';
import { AlreadySignedInPage } from '../../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/primitives/Heading';

const RequestPasswordResetPage: NextPage = () => {
	const { data: user, isLoading: isUserLoading } = useUser();

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return <AlreadySignedInPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Request Password Reset</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="mb-3 flex flex-row justify-between">
					<Heading>Request Password Reset</Heading>
				</div>

				<RequestPasswordResetForm />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default RequestPasswordResetPage;
