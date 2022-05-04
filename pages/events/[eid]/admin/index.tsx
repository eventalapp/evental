import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import React from 'react';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { Navigation } from '../../../../components/navigation';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import Column from '../../../../components/layout/Column';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import EventNavigationMenu from '../../../../components/radix/components/EventNavigationMenu';
import { EventSettingsHeader } from '../../../../components/settings/EventSettingsHeader';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading) {
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

			<Navigation />

			<Column>
				{event && <EventSettingsHeader event={event} />}

				<EventNavigationMenu eid={String(eid)} />

				<h1 className="text-3xl font-bold">Event Settings</h1>

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
