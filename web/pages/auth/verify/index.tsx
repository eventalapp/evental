import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useUser, useVerifyEmail } from '@eventalapp/shared/hooks';

import { LoadingSpinner } from '../../../components/error/LoadingSpinner';
import { UnauthorizedPage } from '../../../components/error/UnauthorizedPage';
import Column from '../../../components/layout/Column';
import { Footer } from '../../../components/layout/Footer';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';

const VerifyEmailPage: NextPage = () => {
	const { data: user } = useUser();
	const router = useRouter();
	const { mutate: verifyEmail } = useVerifyEmail();
	const { code } = router.query;

	useEffect(() => {
		if (code && user && !user.emailVerified) {
			verifyEmail({ code: String(code) });
		}
	}, [user, code]);

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (user && user.emailVerified) {
		return (
			<PageWrapper>
				<NextSeo
					title="Verify Email — Evental"
					description="Verify your email for your Evental account"
					openGraph={{
						url: 'https://evental.app/auth/verify',
						title: 'Verify Email — Evental',
						description: 'Verify your email for your Evental account',
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
					<div className="flex flex-col items-center">
						<h1 className="mb-3 text-2xl font-bold md:text-3xl">Verify Your Account</h1>

						<p>You have already verified your email</p>
					</div>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<NextSeo
				title="Verify Email — Evental"
				description="Verify your email for your Evental account"
				openGraph={{
					url: 'https://evental.app/auth/verify',
					title: 'Verify Email — Evental',
					description: 'Verify your email for your Evental account',
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
				<div className="flex flex-col items-center">
					<h1 className="mb-3 text-2xl font-bold md:text-3xl">Verify Your Account</h1>

					{code ? (
						<p>
							<LoadingSpinner /> Verifying email...
						</p>
					) : (
						<p>Invalid verification code.</p>
					)}
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default VerifyEmailPage;
