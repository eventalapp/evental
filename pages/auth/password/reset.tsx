import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { AlreadySignedInPage } from '../../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { LinkButton } from '../../../components/form/LinkButton';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { PasswordResetForm } from '../../../components/password/PasswordResetForm';
import { PASSWORD_RESET_EXPIRY } from '../../../config';
import { usePasswordReset } from '../../../hooks/mutations/usePasswordReset';
import { useUser } from '../../../hooks/queries/useUser';

const ResetPasswordPage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { passwordResetMutation } = usePasswordReset();
	const { code } = router.query;

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return <AlreadySignedInPage />;
	}

	if (!code) {
		return (
			<PageWrapper>
				<Head>
					<title>Reset Password</title>
				</Head>

				<Navigation />

				<Column variant="halfWidth">
					<div className="mb-3 flex flex-row justify-between">
						<h1 className="text-2xl font-bold md:text-3xl">Reset Password</h1>
					</div>

					<p>
						Invalid password reset code supplied. Reset codes expire after{' '}
						{PASSWORD_RESET_EXPIRY / 60} minutes.
					</p>

					<Link href="/auth/password/request" passHref>
						<LinkButton className="mt-3">Request new code</LinkButton>
					</Link>
				</Column>

				<Footer />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Head>
				<title>Reset Password</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="mb-3 flex flex-row justify-between">
					<h1 className="text-2xl font-bold md:text-3xl">Reset Password</h1>
				</div>

				<PasswordResetForm passwordResetMutation={passwordResetMutation} code={String(code)} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default ResetPasswordPage;
