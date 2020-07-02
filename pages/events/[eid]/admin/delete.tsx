import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../components/Footer';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/typography/Heading';
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

	if (!user?.id) {
		return <UnauthorizedPage />;
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

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{event && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete an event ("{event.name}")
					</p>
				)}

				<Heading>Delete Event</Heading>

				<DeleteEventForm
					eventError={eventError}
					deleteEventMutation={deleteEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeleteEventPage;
