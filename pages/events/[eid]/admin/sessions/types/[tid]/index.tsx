import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { ViewSessionType } from '../../../../../../../components/sessions/ViewSessionType';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';
import { useSessionsByTypeQuery } from '../../../../../../../hooks/queries/useSessionsByTypeQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const ViewSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { tid, eid } = router.query;
	const { user } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { isSessionTypeLoading, sessionType, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);
	const { sessionsByTypeData, isSessionsByTypeLoading } = useSessionsByTypeQuery(
		String(eid),
		String(tid)
	);

	if (
		isOrganizerLoading ||
		isSessionTypeLoading ||
		isRolesLoading ||
		isEventLoading ||
		isSessionsByTypeLoading
	) {
		return <LoadingPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!sessionType) {
		return <NotFoundPage message="Session Type not found." />;
	}

	if (!sessionsByTypeData) {
		return <NotFoundPage message="Sessions not found." />;
	}

	if (sessionTypeError || rolesError || eventError) {
		return <ViewErrorPage errors={[sessionTypeError, eventError, rolesError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Viewing Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewSessionType
					sessionType={sessionType}
					eid={String(eid)}
					tid={String(tid)}
					sessions={sessionsByTypeData}
					event={event}
					user={user}
					admin
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewSessionTypePage;
