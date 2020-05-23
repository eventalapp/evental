import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { LoadingInner } from '../components/error/LoadingInner';
import { LoadingPage } from '../components/error/LoadingPage';
import { NotFoundPage } from '../components/error/NotFoundPage';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { UserSettingsForm } from '../components/settings/UserSettingsForm';
import { useEditUserMutation } from '../hooks/mutations/useEditUserMutation';
import { useRequestVerificationEmail } from '../hooks/mutations/useRequestVerificationEmail';
import { useUser } from '../hooks/queries/useUser';
import { ssrGetUser } from '../utils/api';
import { PasswordlessUser } from '../utils/stripUserPassword';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SettingsPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
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

	if (!user) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Settings — Evental</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				{canVerify && !user.emailVerified && (
					<button
						className="block w-full bg-primary block text-white px-5 py-3 rounded-md mb-4 font-medium"
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

				<h1 className="text-2xl md:text-3xl font-bold">User Settings</h1>

				<UserSettingsForm
					user={user}
					editUserMutation={editUserMutation}
					isUserLoading={isUserLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;

	return {
		props: {
			initialUser
		}
	};
};

export default SettingsPage;
