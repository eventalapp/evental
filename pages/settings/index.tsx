import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';

import { UserSettingsForm } from '../../components/authentication/UserSettingsForm';
import { LoadingInner } from '../../components/error/LoadingInner';
import { LoadingPage } from '../../components/error/LoadingPage';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { useRequestVerificationEmail } from '../../hooks/mutations/useRequestVerificationEmail';
import { useUserSettingsMutation } from '../../hooks/mutations/useUserSettingsMutation';
import { useUser } from '../../hooks/queries/useUser';

const SettingsPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { userSettingsMutation } = useUserSettingsMutation(String(user?.id));
	const { requestVerificationEmailMutation } = useRequestVerificationEmail();
	const [canVerify, setCanVerify] = useState(true);

	useEffect(() => {
		if (requestVerificationEmailMutation.isSuccess) {
			setCanVerify(false);
		}
	}, [requestVerificationEmailMutation.isSuccess]);

	if (isUserLoading) {
		return <LoadingPage />;
	}

	return (
		<>
			<NextSeo
				title="Settings — Evental"
				description={`Update the form below to update your profile.`}
				openGraph={{
					url: 'https://evental.app/settings',
					title: 'Settings — Evental',
					description: `Update the form below to update your profile.`,
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

			<PageWrapper>
				<Column variant="halfWidth">
					{canVerify && user && !user.emailVerified && (
						<button
							className="mb-4 block w-full rounded-md bg-primary py-3 px-5 font-medium text-white"
							disabled={requestVerificationEmailMutation.isLoading}
							onClick={() => {
								requestVerificationEmailMutation.mutate();
							}}
						>
							{requestVerificationEmailMutation.isLoading ? (
								<LoadingInner />
							) : (
								'Your account is not verified. Click here to request a verification email.'
							)}
						</button>
					)}

					<Heading>Settings</Heading>

					<UserSettingsForm user={user} userSettingsMutation={userSettingsMutation} />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default SettingsPage;
