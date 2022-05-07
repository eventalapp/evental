import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import Column from '../../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../../components/error/LoadingPage';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';
import { ViewSessionType } from '../../../../../../../components/sessions/ViewSessionType';
import { useSessionsByTypeQuery } from '../../../../../../../hooks/queries/useSessionsByTypeQuery';

const ViewSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { tid, eid } = router.query;
	const { user } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isSessionTypeLoading, sessionType, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);
	const sessionsByTypeQuery = useSessionsByTypeQuery(String(eid), String(tid));

	if (isOrganizerLoading || isSessionTypeLoading || isRolesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session Type not found." />;
	}

	if (!sessionsByTypeQuery.data) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (sessionTypeError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionTypeError, eventError, rolesError]} />;
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
				<ViewSessionType
					sessionType={sessionType}
					eid={String(eid)}
					tid={String(tid)}
					sessions={sessionsByTypeQuery.data}
					admin
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewSessionTypePage;
