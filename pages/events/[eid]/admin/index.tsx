import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import Column from '../../../../components/layout/Column';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
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
				<title>Event Settings</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Settings</h3>

				<EditEventForm
					eid={String(eid)}
					eventError={eventError}
					editEventMutation={editEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditEventPage;
