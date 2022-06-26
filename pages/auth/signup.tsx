import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../components/Footer';
import { SignUpForm } from '../../components/authentication/SignUpForm';
import { AlreadySignedInPage } from '../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useSignUpMutation } from '../../hooks/mutations/useSignUpMutation';
import { useUser } from '../../hooks/queries/useUser';
import { ssrGetUser } from '../../utils/api';
import { PasswordlessUser } from '../../utils/stripUserPassword';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SignUpPage: NextPage<Props> = (props) => {
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
		<PageWrapper>
			<NextSeo
				title="Sign Up — Evental"
				description="Create an account for Evental. Create, organize, or attend events with ease."
				openGraph={{
					url: 'https://evental.app/auth/signup',
					title: 'Sign Up — Evental',
					description:
						'Create an account for Evental. Create, organize, or attend events with ease.',
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<Navigation />

			<Column variant="halfWidth">
				<div className="m-auto max-w-sm">
					<div className="mb-3 flex flex-row justify-between">
						<Heading>Sign up</Heading>
					</div>

					<SignUpForm signUpMutation={signUpMutation} />
				</div>
			</Column>

			<Footer />
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

export default SignUpPage;
