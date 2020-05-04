import { NextPage } from 'next';
import React from 'react';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useUser } from '../../../hooks/queries/useUser';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { RequestPasswordResetForm } from '../../../components/password/RequestPasswordResetForm';
import { useRequestPasswordReset } from '../../../hooks/mutations/useRequestPasswordReset';
import Head from 'next/head';
import { AlreadySignedInPage } from '../../../components/error/AlreadySignedInPage';

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
		<PageWrapper variant="gray">
			<Head>
				<title>Request Password Reset</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-2xl md:text-3xl font-bold">Request Password Reset</h1>
				</div>

				<RequestPasswordResetForm requestPasswordResetMutation={requestPasswordResetMutation} />
			</Column>
		</PageWrapper>
	);
};

export default RequestPasswordResetPage;
