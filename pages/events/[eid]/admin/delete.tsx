import type { NextPage } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { Loading } from '../../../../components/error/Loading';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { useUser } from '../../../../hooks/queries/useUser';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';

const DeleteEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { deleteEventMutation } = useDeleteEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isEventLoading || isOrganizerLoading || isUserLoading || isRolesLoading) {
		return <Loading />;
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
				<title>Delete Event</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete an event ("{event.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Event</h1>

				<DeleteEventForm
					eventError={eventError}
					deleteEventMutation={deleteEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default DeleteEventPage;
