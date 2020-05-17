import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { Navigation } from '../../../components/navigation';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useUser } from '../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../utils/api';
import { useVerifyEmail } from '../../../hooks/mutations/useVerifyAccount';
import { LoadingSpinner } from '../../../components/error/LoadingSpinner';
import { UnauthorizedPage } from '../../../components/error/UnauthorizedPage';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const VerifyEmailPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const router = useRouter();
	const { verifyEmailMutation } = useVerifyEmail();
	const { code } = router.query;

	useEffect(() => {
		if (code && user && !user.emailVerified) {
			verifyEmailMutation.mutate({ code: String(code) });
		}
	}, [user, code]);

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (user && user.emailVerified) {
		return (
			<PageWrapper variant="gray">
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
					<div className="flex items-center flex-col">
						<h1 className="text-2xl md:text-3xl font-bold mb-3">Verify Your Account</h1>

						<p>You have already verified your email</p>
					</div>
				</Column>
			</PageWrapper>
		);
	}

	if (isUserLoading) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper variant="gray">
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
				<div className="flex items-center flex-col">
					<h1 className="text-2xl md:text-3xl font-bold mb-3">Verify Your Account</h1>

					{code ? (
						<p>
							<LoadingSpinner /> Verifying email...
						</p>
					) : (
						<p>Invalid verification code.</p>
					)}
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

export default VerifyEmailPage;
