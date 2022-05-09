import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import { useSignUpMutation } from '../../hooks/mutations/useSignUpMutation';
import { SignUpForm } from '../../components/authentication/SignUpForm';
import { ssrGetUser } from '../../utils/api';
import { LoadingPage } from '../../components/error/LoadingPage';
import { useUser } from '../../hooks/queries/useUser';
import { AlreadySignedInPage } from '../../components/error/AlreadySignedInPage';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { useRouter } from 'next/router';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SignInPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const router = useRouter();
	const { signUpMutation } = useSignUpMutation({
		redirectUrl: router.query.redirectUrl ? String(router.query.redirectUrl) : undefined
	});
	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return <AlreadySignedInPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Navigation />

			<Column variant="halfWidth">
				<div className="max-w-sm m-auto">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-2xl md:text-3xl font-bold">Sign up</h1>
					</div>

					<SignUpForm signUpMutation={signUpMutation} />
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
