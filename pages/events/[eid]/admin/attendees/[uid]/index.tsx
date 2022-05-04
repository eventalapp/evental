import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewAttendee } from '../../../../../../components/attendees/ViewAttendee';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useAttendeeQuery } from '../../../../../../hooks/queries/useAttendeeQuery';
import Column from '../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import React from 'react';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { uid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(uid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();

	if (isAttendeeLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (attendeeError || eventError || rolesError) {
		return <ViewErrorPage errors={[attendeeError, eventError, rolesError]} />;
	}

	if (!attendee || !attendee.user || !attendee.role) {
		return <NotFoundPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewAttendee admin attendee={attendee} eid={String(eid)} uid={String(uid)} />
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
