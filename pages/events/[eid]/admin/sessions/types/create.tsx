import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { CreateSessionTypeForm } from '../../../../../../components/sessions/CreateSessionTypeForm';
import { useCreateSessionTypeMutation } from '../../../../../../hooks/mutations/useCreateSessionTypeMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { createSessionTypeMutation } = useCreateSessionTypeMutation(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Session Type</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Create Session Types</h3>

				<CreateSessionTypeForm createSessionTypeMutation={createSessionTypeMutation} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default CreateSessionPage;
