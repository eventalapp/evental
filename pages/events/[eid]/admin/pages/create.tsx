import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreatePageForm } from '../../../../../components/pages/CreatePageForm';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreatePageMutation } from '../../../../../hooks/mutations/useCreatePageMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';

const CreatePagePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createPageMutation } = useCreatePageMutation(String(eid));
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
				<title>Create Page</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Create Page</h3>

				<CreatePageForm eid={String(eid)} createPageMutation={createPageMutation} />
			</Column>
		</PageWrapper>
	);
};

export default CreatePagePage;
