import { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Navigation } from '../../../../../components/navigation';
import Column from '../../../../../components/layout/Column';
import { AcceptRoleInviteSchema } from '../../../../../utils/schemas';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useRoleQuery } from '../../../../../hooks/queries/useRoleAttendeesQuery';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { Button } from '../../../../../components/form/Button';
import { useAcceptRoleInviteMutation } from '../../../../../hooks/mutations/useAcceptRoleInviteMutation';

const RoleInvitePage: NextPage = () => {
	const router = useRouter();
	const { user, isUserLoading } = useUser();
	const { eid, rid, code } = router.query;
	const { acceptRoleInviteMutation } = useAcceptRoleInviteMutation(String(eid), String(rid));
	const { role, isRoleLoading } = useRoleQuery(String(eid), String(rid));

	if (isUserLoading || isRoleLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!role) {
		return <NotFoundPage message="Role not found" />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Accept {role.name} Invite</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-2xl md:text-3xl font-bold">Accept {role.name} Invite</h1>
				</div>

				<p className="text-md text-gray-700 mb-2">
					Roles are used to separate users into different groups.
				</p>

				<div className="flex flex-row justify-end">
					<Button type="button" variant="no-bg" onClick={router.back}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							const data = AcceptRoleInviteSchema.parse({ code: String(code) });

							acceptRoleInviteMutation.mutate(data);
						}}
					>
						Accept Invite
					</Button>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default RoleInvitePage;
