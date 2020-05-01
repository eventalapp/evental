import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import { SignInForm } from '../../components/authentication/SignInForm';
import { useSignInMutation } from '../../hooks/mutations/useSignInMutation';
import { PasswordlessUser, ssrGetUser } from '../../utils/api';
import { useUser } from '../../hooks/queries/useUser';
import { LoadingPage } from '../../components/error/LoadingPage';
import Link from 'next/link';
import { LinkButton } from '../../components/form/LinkButton';

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
		return (
			<PageWrapper variant="gray">
				<Navigation />

				<Column variant="halfWidth">
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
	}

	return (
		<PageWrapper variant="gray">
			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl font-bold">Sign in</h1>
				</div>

				<SignInForm signInMutation={signInMutation} />
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
