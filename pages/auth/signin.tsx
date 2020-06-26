import { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../components/Footer';
import { SignInForm } from '../../components/authentication/SignInForm';
import { AlreadySignedInPage } from '../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useSignInMutation } from '../../hooks/mutations/useSignInMutation';
import { useUser } from '../../hooks/queries/useUser';
import { ssrGetUser } from '../../utils/api';
import { PasswordlessUser } from '../../utils/stripUserPassword';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SignInPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const router = useRouter();
	let params = new URLSearchParams();

	if (router.query.redirectUrl) {
		params.append('redirectUrl', String(router.query.redirectUrl));
	}

	const { signInMutation } = useSignInMutation({
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
				title="Sign In — Evental"
				description="Sign into your Evental account. Create, organize, or attend events with ease."
				openGraph={{
					url: 'https://evental.app/auth/signin',
					title: 'Sign In — Evental',
					description:
						'Sign into your Evental account. Create, organize, or attend events with ease.',
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
						<Heading>Sign in</Heading>
					</div>

					<SignInForm signInMutation={signInMutation} params={params.toString()} />
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

export default SignInPage;
