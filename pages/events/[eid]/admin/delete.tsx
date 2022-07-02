import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../components/AdminPageWrapper';
import { Footer } from '../../../../components/Footer';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Heading } from '../../../../components/typography/Heading';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';

const DeleteEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { deleteEventMutation } = useDeleteEventMutation(String(eid));

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
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
		</AdminPageWrapper>
	);
};

export default DeleteEventPage;
