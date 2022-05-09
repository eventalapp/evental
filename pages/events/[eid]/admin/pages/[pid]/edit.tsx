import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { EditPageForm } from '../../../../../../components/pages/EditPageForm';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { useEditPageMutation } from '../../../../../../hooks/mutations/useEditPageMutation';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';

const EditPagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));
	const { editPageMutation } = useEditPageMutation(String(eid), String(pid));
	const { user, isUserLoading } = useUser();
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isRolesLoading || isVenuesLoading || isEventLoading || isUserLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!page) {
		return <NotFoundPage message="Page not found" />;
	}

	if (!venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (venuesError || eventError) {
		return <ViewErrorPage errors={[venuesError, eventError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Page</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Edit Page</h3>

				<EditPageForm
					eid={String(eid)}
					page={page}
					editPageMutation={editPageMutation}
					isPageLoading={isPageLoading}
					pageError={pageError}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditPagePage;
