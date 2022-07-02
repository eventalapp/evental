import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { AdminPageWrapper } from '../../../../components/AdminPageWrapper';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { LinkButton } from '../../../../components/form/LinkButton';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../components/typography/Heading';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));

	return (
		<AdminPageWrapper errors={[eventError]} isLoading={isEventLoading} eid={String(eid)}>
			<PageWrapper>
				<Head>
					<title>Event Settings</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<Heading>Settings</Heading>

						{event && (
							<EditEventForm
								eid={String(eid)}
								eventError={eventError}
								editEventMutation={editEventMutation}
								event={event}
								isEventLoading={isEventLoading}
							/>
						)}

						<p className="mt-5 mb-3 text-lg font-bold text-red-600">Danger Zone</p>

						<div className="rounded-md border shadow-sm p-4">
							<Link href={`/events/${eid}/admin/delete`} passHref>
								<LinkButton variant="danger">Delete Event</LinkButton>
							</Link>
						</div>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default EditEventPage;
