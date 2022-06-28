import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { Footer } from '../components/Footer';
import { LoadingInner } from '../components/error/LoadingInner';
import { LoadingPage } from '../components/error/LoadingPage';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { UserSettingsForm } from '../components/settings/UserSettingsForm';
import { Heading } from '../components/typography/Heading';
import { useEditUserMutation } from '../hooks/mutations/useEditUserMutation';
import { useRequestVerificationEmail } from '../hooks/mutations/useRequestVerificationEmail';
import { useUser } from '../hooks/queries/useUser';

const SettingsPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { editUserMutation } = useEditUserMutation(String(user?.id));
	const { requestVerificationEmailMutation } = useRequestVerificationEmail();
	const [canVerify, setCanVerify] = useState(true);

	useEffect(() => {
		if (requestVerificationEmailMutation.isSuccess) {
			setCanVerify(false);
		}
	}, [requestVerificationEmailMutation.isSuccess]);

	if (isUserLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Settings — Evental</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				{canVerify && user && !user.emailVerified && (
					<button
						className="mb-4 block w-full rounded-md bg-primary py-3 px-5 font-medium text-white"
						disabled={requestVerificationEmailMutation.isLoading}
						onClick={() => {
							requestVerificationEmailMutation.mutate();
						}}
					>
						{requestVerificationEmailMutation.isLoading ? (
							<LoadingInner />
						) : (
							'Your account is not verified. Click here to request a verification email.'
						)}
					</button>
				)}

				<Heading>Settings</Heading>

				<UserSettingsForm
					user={user}
					editUserMutation={editUserMutation}
					isUserLoading={isUserLoading}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default SettingsPage;
