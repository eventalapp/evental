import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeletePageForm } from '../../../../../../components/pages/DeletePageForm';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { useDeletePageMutation } from '../../../../../../hooks/mutations/useDeletePageMutation';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';

const DeletePagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
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
		<PageWrapper variant="gray">
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
		</PageWrapper>
	);
};

export default DeletePagePage;