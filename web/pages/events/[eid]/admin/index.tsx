import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { useEvent } from '@eventalapp/shared/hooks';

import DeleteEventDialog from '../../../../components/events/DeleteEventDialog';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { AdminPageWrapper } from '../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Button } from '../../../../components/primitives/Button';
import { Heading } from '../../../../components/primitives/Heading';
import { useEditEvent } from '../../../../hooks/mutations/useEditEvent';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const {
		data: event,
		error: eventError,
		isLoading: isEventLoading
	} = useEvent({ eid: String(eid) });
	const { editEventMutation } = useEditEvent(String(eid));

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Event Settings</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Settings</Heading>

						{event && (
							<EditEventForm
								eid={String(eid)}
								event={event}
								editEventMutation={editEventMutation}
							/>
						)}

						<p className="mt-5 mb-3 text-lg font-bold text-red-600">Danger Zone</p>

						<div className="rounded-md border p-4 shadow-sm">
							<DeleteEventDialog eid={String(eid)}>
								<Button variant="danger">Delete Event</Button>
							</DeleteEventDialog>
						</div>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditEventPage;
