import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditPageForm } from '../../../../../../components/pages/EditPageForm';
import { useEditPageMutation } from '../../../../../../hooks/mutations/useEditPageMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';

const EditPagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
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
		<PageWrapper>
			<Head>
				<title>Edit Page</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl font-medium md:text-2xl">Edit Page</h3>

				<EditPageForm
					eid={String(eid)}
					page={page}
					editPageMutation={editPageMutation}
					isPageLoading={isPageLoading}
					pageError={pageError}
				/>
			</Column>

			<Footer color={event.color} />
		</PageWrapper>
	);
};

export default EditPagePage;
