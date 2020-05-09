import { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';
import { Navigation } from '../../../../components/navigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { Button } from '../../../../components/form/Button';
import { useAcceptOrganizerInviteMutation } from '../../../../hooks/mutations/useAcceptOrganizerInviteMutation';
import { AcceptOrganizerInviteSchema } from '../../../../utils/schemas';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';

const OrganizerInvitePage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { eid, code } = router.query;
	const { acceptOrganizerInviteMutation } = useAcceptOrganizerInviteMutation(String(eid));

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Reset Password</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-2xl md:text-3xl font-bold">Accept Organizer Invite</h1>
				</div>

				<Button
					onClick={() => {
						const data = AcceptOrganizerInviteSchema.parse({ code: String(code) });

						acceptOrganizerInviteMutation.mutate(data);
					}}
				>
					Accept Invite
				</Button>
			</Column>
		</PageWrapper>
	);
};

export default OrganizerInvitePage;
