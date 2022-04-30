import { NextPage } from 'next';
import React from 'react';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import PageWrapper from '../../components/layout/PageWrapper';
import { SignInForm } from '../../components/authentication/SignInForm';
import { useSignInMutation } from '../../hooks/mutations/useSignInMutation';

const SignInPage: NextPage = () => {
	const { signInMutation } = useSignInMutation();

	return (
		<PageWrapper variant="gray">
			<Navigation />

			<Column>
				<SignInForm signInMutation={signInMutation} />
			</Column>
		</PageWrapper>
	);
};

export default SignInPage;
