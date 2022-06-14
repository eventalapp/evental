import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import { Footer } from '../../../../../../components/Footer';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeletePageForm } from '../../../../../../components/pages/DeletePageForm';
import { useDeletePageMutation } from '../../../../../../hooks/mutations/useDeletePageMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeletePagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));
	const { deletePageMutation } = useDeletePageMutation(String(eid), String(pid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isPageLoading || isUserLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
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

	if (pageError) {
		return <ViewErrorPage errors={[pageError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Page</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete an page ("{page.name}")
				</p>

				<h1 className="text-2xl md:text-3xl font-bold">Delete Page</h1>

				<DeletePageForm
					page={page}
					isPageLoading={isPageLoading}
					pageError={pageError}
					deletePageMutation={deletePageMutation}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default DeletePagePage;
