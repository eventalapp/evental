import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { AlreadySignedInPage } from '../../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { RequestPasswordResetForm } from '../../../components/password/RequestPasswordResetForm';
import { useRequestPasswordReset } from '../../../hooks/mutations/useRequestPasswordReset';
import { useUser } from '../../../hooks/queries/useUser';

const RequestPasswordResetPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { requestPasswordResetMutation } = useRequestPasswordReset();

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
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-2xl font-bold md:text-3xl">Request Password Reset</h1>
				</div>

				<RequestPasswordResetForm requestPasswordResetMutation={requestPasswordResetMutation} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default RequestPasswordResetPage;
