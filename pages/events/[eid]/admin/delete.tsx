import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { DeleteEventForm } from '../../../../components/events/DeleteEventForm';
import { Navigation } from '../../../../components/navigation';
import Unauthorized from '../../../../components/Unauthorized';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useDeleteEventMutation } from '../../../../hooks/mutations/useDeleteEventMutation';
import React from 'react';

const DeleteEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { deleteEventMutation, deleteEventError } = useDeleteEventMutation(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<>
			<Head>
				<title>Delete event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Event</h1>

				<DeleteEventForm
					deleteEventError={deleteEventError}
					eventError={eventError}
					deleteEventMutation={deleteEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</>
	);
};

export default DeleteEventPage;
