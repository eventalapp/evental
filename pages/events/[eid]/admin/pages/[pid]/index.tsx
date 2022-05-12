import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import Column from '../../../../../../components/layout/Column';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewPage } from '../../../../../../components/pages/ViewPage';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';

const ViewPagePage: NextPage = () => {
	const router = useRouter();
	const { pid, eid } = router.query;
	const { user } = useUser();
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	if (isOrganizerLoading || isPageLoading || isRolesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (!page) {
		return <NotFoundPage message="Page not found." />;
	}

	if (pageError || rolesError || eventError) {
		return <ViewErrorPage errors={[pageError, eventError, rolesError]} />;
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
				<title>Viewing Page</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<ViewPage admin page={page} eid={String(eid)} pid={String(pid)} />
			</Column>
		</PageWrapper>
	);
};

export default ViewPagePage;