import type { NextPage } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';

const DeleteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleError, role, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (
		isOrganizerLoading ||
		isRoleLoading ||
		isUserLoading ||
		isEventLoading ||
		isRolesLoading ||
		isAttendeesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!role || !attendeesData) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleError) {
		return <ViewErrorPage errors={[roleError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete a role ("{role.name}")
				</p>

				<h1 className="text-2xl md:text-3xl font-bold">Delete Role</h1>

				<DeleteRoleForm
					role={role}
					roleError={roleError}
					deleteRoleMutation={deleteRoleMutation}
					isRoleLoading={isRoleLoading}
					attendees={attendeesData}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteRolePage;
