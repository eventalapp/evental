import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { FlexRowBetween } from '../../../../../../components/layout/FlexRowBetween';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { InviteRoleForm } from '../../../../../../components/roles/InviteRoleForm';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import Column from '../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useInviteRoleMutation } from '../../../../../../hooks/mutations/useInviteRoleMutation';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';

const InviteRolePage: NextPage = () => {
	const router = useRouter();
	const { eid, rid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { inviteRoleMutation } = useInviteRoleMutation(String(eid), String(rid));
	const { role, isRoleLoading } = useRoleQuery(String(eid), String(rid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading || isRoleLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!role) {
		return <NotFoundPage message="Role not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Invite Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">Invite {role.name}</h3>
				</FlexRowBetween>

				<p className="text-md text-gray-700 mb-2">
					Roles are used to separate users into different groups.
				</p>

				<InviteRoleForm inviteRoleMutation={inviteRoleMutation} />
			</Column>
		</PageWrapper>
	);
};

export default InviteRolePage;
