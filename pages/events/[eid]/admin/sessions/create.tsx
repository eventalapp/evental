import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateSessionForm } from '../../../../../components/sessions/CreateSessionForm';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateSessionMutation } from '../../../../../hooks/mutations/useCreateSessionMutation';
import React from 'react';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { createSessionMutation } = useCreateSessionMutation(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isVenuesLoading || isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError) {
		return <ViewErrorPage errors={[venuesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h1 className="text-3xl font-bold">Create Session</h1>

				<CreateSessionForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createSessionMutation={createSessionMutation}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default CreateSessionPage;
