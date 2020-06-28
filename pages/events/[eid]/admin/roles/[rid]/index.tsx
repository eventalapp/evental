import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewRole } from '../../../../../../components/roles/ViewRole';
import { useAttendeesByRoleQuery } from '../../../../../../hooks/queries/useAttendeesByRoleQuery';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { useRoleQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { role, roleError, isRoleLoading } = useRoleQuery(String(eid), String(rid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user } = useUser();
	const { attendeesData, isAttendeesLoading } = useAttendeesByRoleQuery(String(eid), String(rid));

	if (!role || !attendeesData) {
		return <NotFoundPage message="Role not found." />;
	}

	if (roleError || eventError || rolesError) {
		return <ViewErrorPage errors={[roleError, rolesError, eventError]} />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Viewing Role</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column>
				<ViewRole attendees={attendeesData} eid={String(eid)} rid={String(rid)} role={role} admin />
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default ViewAttendeePage;
