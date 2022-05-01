import { NextPage } from 'next';
import React from 'react';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useUser } from '../../../hooks/queries/useUser';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { LinkButton } from '../../../components/form/LinkButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PASSWORD_RESET_EXPIRY } from '../../../config';
import { PasswordResetForm } from '../../../components/password/PasswordResetForm';
import { usePasswordReset } from '../../../hooks/mutations/usePasswordReset';

const ResetPasswordPage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { passwordResetMutation } = usePasswordReset();
	const { code } = router.query;

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return (
			<PageWrapper variant="gray">
				<Navigation />

				<Column variant="halfWidth">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-3xl font-bold">Reset Password</h1>
					</div>

					<p>You are already signed in.</p>

					<Link href="/" passHref>
						<LinkButton className="mt-3">Return home</LinkButton>
					</Link>
				</Column>
			</PageWrapper>
		);
	}

	if (!code) {
		return (
			<PageWrapper variant="gray">
				<Navigation />

				<Column variant="halfWidth">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-3xl font-bold">Reset Password</h1>
					</div>

					<p>
						Invalid password reset code supplied. Reset codes expire after {PASSWORD_RESET_EXPIRY}{' '}
						minutes.
					</p>

					<Link href="/auth/password/request" passHref>
						<LinkButton className="mt-3">Request new code</LinkButton>
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
					<h1 className="text-3xl font-bold">Reset Password</h1>
				</div>

				<PasswordResetForm passwordResetMutation={passwordResetMutation} code={String(code)} />
			</Column>
		</PageWrapper>
	);
};

export default ResetPasswordPage;
