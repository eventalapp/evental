import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useUser } from '@eventalapp/shared/hooks';
import { CLAIM_PROFILE_EXPIRY } from '@eventalapp/shared/utils';

import { ClaimProfileForm } from '../../../components/authentication/ClaimProfileForm';
import { AlreadySignedInPage } from '../../../components/error/AlreadySignedInPage';
import { LoadingPage } from '../../../components/error/LoadingPage';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/primitives/Heading';
import { LinkButton } from '../../../components/primitives/LinkButton';
import { useClaimProfile } from '../../../hooks/mutations/useClaimProfile';

const ClaimProfilePage: NextPage = () => {
	const router = useRouter();
	const { data: user, isLoading: isUserLoading } = useUser();
	const { claimProfileMutation } = useClaimProfile();
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
					<title>Claim Profile</title>
				</Head>

				<Navigation />

				<Column variant="halfWidth">
					<div className="mb-3 flex flex-row justify-between">
						<Heading>Claim Profile</Heading>
					</div>

					<p>
						Invalid profile code supplied. Reset codes expire after{' '}
						{CLAIM_PROFILE_EXPIRY / 60 / 60 / 24} days.
					</p>

					<Link href="/auth/signup" passHref>
						<LinkButton className="mt-3" variant="primary">
							Create an account
						</LinkButton>
					</Link>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Head>
				<title>Claim Profile</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="mb-3 flex flex-row justify-between">
					<Heading>Claim Profile</Heading>
				</div>

				<p>
					To claim your profile, please set your password below. If you ever forget your password,
					you can reset it at the sign in page.
				</p>

				<ClaimProfileForm claimProfileMutation={claimProfileMutation} code={String(code)} />
			</Column>
		</PageWrapper>
	);
};

export default ClaimProfilePage;
