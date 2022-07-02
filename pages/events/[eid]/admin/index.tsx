import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EditEventForm } from '../../../../components/events/EditEventForm';
import { LinkButton } from '../../../../components/form/LinkButton';
import Column from '../../../../components/layout/Column';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../components/sidebar/SidebarWrapper';
import { Heading } from '../../../../components/typography/Heading';
import { useEditEventMutation } from '../../../../hooks/mutations/useEditEventMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useUser } from '../../../../hooks/queries/useUser';

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { editEventMutation } = useEditEventMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	const isLoading = isEventLoading || isOrganizerLoading || isUserLoading;

	if (!isLoading && !user?.id) {
		return <UnauthorizedPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	return (
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
	);
};

export default EditEventPage;
