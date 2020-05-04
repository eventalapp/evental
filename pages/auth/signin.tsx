import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import { SignInForm } from '../../components/authentication/SignInForm';
import { useSignInMutation } from '../../hooks/mutations/useSignInMutation';
import { ssrGetUser } from '../../utils/api';
import { useUser } from '../../hooks/queries/useUser';
import { LoadingPage } from '../../components/error/LoadingPage';
import Head from 'next/head';
import { AlreadySignedInPage } from '../../components/error/AlreadySignedInPage';
import { PasswordlessUser } from '../../utils/stripUserPassword';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SignInPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const { signInMutation } = useSignInMutation();

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return <AlreadySignedInPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Sign In</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="max-w-sm m-auto">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-2xl md:text-3xl font-bold">Sign in</h1>
					</div>

					<SignInForm signInMutation={signInMutation} />
				</div>
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

export default SignInPage;
