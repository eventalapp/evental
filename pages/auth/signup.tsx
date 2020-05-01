import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import { useSignUpMutation } from '../../hooks/mutations/useSignUpMutation';
import { SignUpForm } from '../../components/authentication/SignUpForm';
import { PasswordlessUser, ssrGetUser } from '../../utils/api';
import { LoadingPage } from '../../components/error/LoadingPage';
import { useUser } from '../../hooks/queries/useUser';
import Link from 'next/link';
import { LinkButton } from '../../components/form/LinkButton';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SignInPage: NextPage<Props> = (props) => {
	const { signUpMutation } = useSignUpMutation();
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return (
			<PageWrapper variant="gray">
				<Navigation />

				<Column variant="halfWidth">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-3xl font-bold">Sign up</h1>
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
					<h1 className="text-3xl font-bold">Sign up</h1>
				</div>

				<SignUpForm signUpMutation={signUpMutation} />
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
