import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import PageWrapper from '../components/layout/PageWrapper';
import { UserSettingsForm } from '../components/settings/UserSettingsForm';
import { useUser } from '../hooks/queries/useUser';
import { useEditUserMutation } from '../hooks/mutations/useEditUserMutation';
import { ssrGetUser } from '../utils/api';
import { PasswordlessUser } from '../utils/stripUserPassword';
import { LoadingPage } from '../components/error/LoadingPage';
import { NotFoundPage } from '../components/error/NotFoundPage';
import React from 'react';
import { useRequestVerificationEmail } from '../hooks/mutations/useRequestVerificationEmail';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SettingsPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const { editUserMutation } = useEditUserMutation(String(user?.id));
	const { requestVerificationEmailMutation } = useRequestVerificationEmail();

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <NotFoundPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>User Settings</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				{!user.emailVerified && (
					<button
						className="block w-full bg-gradient-to-r from-primary-500 to-secondary-500 block text-white px-5 py-3 rounded-md mb-4 font-medium"
						onClick={() => {
							requestVerificationEmailMutation.mutate();
						}}
					>
						Your account is not verified. Click here to request a verification email.
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
