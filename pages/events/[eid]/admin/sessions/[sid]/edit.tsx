import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { EditSessionForm } from '../../../../../../components/sessions/EditSessionForm';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useEditSessionMutation } from '../../../../../../hooks/mutations/useEditSessionMutation';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { useSessionTypesQuery } from '../../../../../../hooks/queries/useSessionTypesQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { editSessionMutation } = useEditSessionMutation(String(eid), String(sid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { sessionTypes, isSessionTypesLoading, sessionTypesError } = useSessionTypesQuery(
		String(eid)
	);
	if (
		isRolesLoading ||
		isVenuesLoading ||
		isEventLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isSessionTypesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found" />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError || sessionTypesError) {
		return <ViewErrorPage errors={[venuesError, eventError, sessionTypesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold">Edit Session</h1>

				<EditSessionForm
					eid={String(eid)}
					sid={String(sid)}
					venues={venues}
					session={session}
					sessionTypes={sessionTypes}
					isSessionTypesLoading={isSessionTypesLoading}
					sessionTypesError={sessionTypesError}
					editSessionMutation={editSessionMutation}
					isSessionLoading={isSessionLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
					sessionError={sessionError}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditSessionPage;
