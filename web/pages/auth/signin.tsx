import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { SignInForm } from '../../components/authentication/SignInForm';
import { AlreadySignedInPage } from '../../components/error/AlreadySignedInPage';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { useSignInMutation } from '../../hooks/mutations/useSignInMutation';
import { useUser } from '../../hooks/queries/useUser';

const SignInPage: NextPage = () => {
	const { user } = useUser();
	const router = useRouter();
	let params = new URLSearchParams();

	if (router.query.redirectUrl) {
		params.append('redirectUrl', String(router.query.redirectUrl));
	}

	const { signInMutation } = useSignInMutation({
		redirectUrl: router.query.redirectUrl ? String(router.query.redirectUrl) : undefined
	});

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

export default SignInPage;
