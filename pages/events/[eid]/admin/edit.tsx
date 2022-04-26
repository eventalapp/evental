import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { Navigation } from '../../../../components/navigation';
import Unauthorized from '../../../../components/Unauthorized';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import React from 'react';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation, editEventError } = useEditEventMutation(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<>
			<Head>
				<title>Edit event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Event</h1>

				<EditEventForm
					eid={String(eid)}
					editEventError={editEventError}
					eventError={eventError}
					editEventMutation={editEventMutation}
					event={event}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</>
	);
};

export default EditEventPage;
