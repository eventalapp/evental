import type { NextPage } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));
	const { user, isUserLoading } = useUser();

	if (isOrganizerLoading || isRoleAttendeesLoading || isUserLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleAttendeesError) {
		return <ViewErrorPage errors={[roleAttendeesError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Role</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete a role ("{role.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Role</h1>

				<DeleteRoleForm
					role={role}
					roleAttendeesError={roleAttendeesError}
					deleteRoleMutation={deleteRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendees}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteRolePage;
