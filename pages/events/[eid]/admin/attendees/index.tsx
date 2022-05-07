import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';

const AttendeesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { attendees, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isAttendeesLoading ||
		isAttendeesLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Attendees</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<h3 className="text-xl md:text-2xl font-medium">Attendees</h3>
					</FlexRowBetween>

					{attendees && <AttendeeList admin eid={String(eid)} attendees={attendees} />}
				</div>
			</Column>
		</PageWrapper>
	);
};

export default AttendeesAdminPage;
