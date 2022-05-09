import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { UnauthorizedPage } from '../../../../components/error/UnauthorizedPage';
import Column from '../../../../components/layout/Column';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { useUser } from '../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../components/error/NoAccessPage';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../components/events/settingsNavigation';
import { useOrganizersQuery } from '../../../../hooks/queries/useOrganizersQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { Button } from '../../../../components/form/Button';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isOrganizersLoading, organizers } = useOrganizersQuery(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!organizers) {
		return <NotFoundPage message="Organizers not found." />;
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
				<title>Organizers</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">Organizers</h3>
					<Button>Invite Organizer</Button>
				</FlexRowBetween>

				<AttendeeList attendees={organizers} eid={String(eid)} admin />
			</Column>
		</PageWrapper>
	);
};

export default EventOrganizersPage;
