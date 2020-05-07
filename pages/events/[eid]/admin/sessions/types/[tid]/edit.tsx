import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { useVenuesQuery } from '../../../../../../../hooks/queries/useVenuesQuery';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import Column from '../../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../../components/error/LoadingPage';
import { EditSessionTypeForm } from '../../../../../../../components/sessions/EditSessionTypeForm';
import { useEditSessionTypeMutation } from '../../../../../../../hooks/mutations/useEditSessionTypeMutation';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';

const EditSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, tid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { editSessionTypeMutation } = useEditSessionTypeMutation(String(eid), String(tid));
	const { isSessionTypeLoading, sessionType, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);

	if (isRolesLoading || isVenuesLoading || isEventLoading || isUserLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session not found" />;
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
				<title>Edit Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold">Edit Session Type</h1>

				<EditSessionTypeForm
					sessionType={sessionType}
					isSessionTypeLoading={isSessionTypeLoading}
					sessionTypeError={sessionTypeError}
					editSessionTypeMutation={editSessionTypeMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditSessionPage;
