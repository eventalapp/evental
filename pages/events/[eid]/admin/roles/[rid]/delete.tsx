import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeleteRoleForm } from '../../../../../../components/roles/DeleteRoleForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useDeleteRoleMutation } from '../../../../../../hooks/mutations/useDeleteRoleMutation';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { roleError, role, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { deleteRoleMutation } = useDeleteRoleMutation(String(eid), String(rid));
	const { user, isUserLoading } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (roleError) {
		return <NotFoundPage message="Role not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Role</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{role && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete a role ("{role.name}")
					</p>
				)}

				<Heading>Delete Role</Heading>

				{/*TODO: Skeletonize*/}
				{attendeesData && (
					<DeleteRoleForm
						role={role}
						roleError={roleError}
						deleteRoleMutation={deleteRoleMutation}
						isRoleLoading={isRoleLoading}
						attendees={attendeesData}
					/>
				)}
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeleteRolePage;
