import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditRoleForm } from '../../../../../../components/roles/EditRoleForm';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useEditRoleMutation } from '../../../../../../hooks/mutations/useEditRoleMutation';
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

const EditRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleAttendeesError, role, isRoleAttendeesLoading } = useRoleQuery(
		String(eid),
		String(rid)
	);
	const { editRoleMutation } = useEditRoleMutation(String(eid), String(rid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (
		isOrganizerLoading ||
		isRoleAttendeesLoading ||
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

	if (!role || !attendeesData?.attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleAttendeesError) {
		return <ViewErrorPage errors={[roleAttendeesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h3 className="text-xl md:text-2xl font-medium">Edit Role</h3>

				<EditRoleForm
					eid={String(eid)}
					role={role}
					roleAttendeesError={roleAttendeesError}
					editRoleMutation={editRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendeesData?.attendees}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditRolePage;
