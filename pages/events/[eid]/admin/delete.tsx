import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Loading } from '../../../../components/error/Loading';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import { Footer } from '../../../../components/Footer';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';

const DeleteEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { deleteEventMutation } = useDeleteEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
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
		<PageWrapper>
			<Head>
				<title>Delete Event</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block py-3 px-5 mb-4 font-medium text-white bg-red-500 rounded-md">
					You are about to delete an event ("{event.name}")
				</p>

				<h1 className="text-2xl font-bold md:text-3xl">Delete Event</h1>

				<DeleteEventForm
					eventError={eventError}
					deleteEventMutation={deleteEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default DeleteEventPage;
