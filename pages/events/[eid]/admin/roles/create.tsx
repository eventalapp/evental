import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateRoleForm } from '../../../../../components/roles/CreateRoleForm';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateRoleMutation } from '../../../../../hooks/mutations/useCreateRoleMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';

const CreateRolePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createRoleMutation } = useCreateRoleMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isOrganizerLoading || isUserLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Role</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h1 className="text-3xl font-bold">Create Role Page</h1>

				<CreateRoleForm eid={String(eid)} createRoleMutation={createRoleMutation} />
			</Column>
		</PageWrapper>
	);
};

export default CreateRolePage;
