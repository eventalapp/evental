import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewSession } from '../../../../../../components/sessions/ViewSession';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionAttendeeQuery } from '../../../../../../hooks/queries/useSessionAttendeeQuery';
import { useSessionAttendeesQuery } from '../../../../../../hooks/queries/useSessionAttendeesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser();
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { sessionAttendeeQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id)
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(String(eid), String(sid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

	if (isOrganizerLoading || isSessionLoading || isRolesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found." />;
	}

	if (sessionError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionError, eventError, rolesError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewSession
					admin
					roleAttendees={sessionRoleAttendeesQuery.data}
					attendees={sessionAttendeesQuery.data}
					isAttending={Boolean(sessionAttendeeQuery.data)}
					session={session}
					eid={String(eid)}
					sid={String(sid)}
					event={event}
				/>
			</Column>
			<Footer />
		</PageWrapper>
	);
};

export default ViewSessionPage;
