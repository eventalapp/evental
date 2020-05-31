import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { DeleteSessionTypeForm } from '../../../../../../../components/sessions/DeleteSessionTypeForm';
import { useDeleteSessionTypeMutation } from '../../../../../../../hooks/mutations/useDeleteSessionTypeMutation';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../../hooks/queries/useRolesQuery';
import { useSessionTypeQuery } from '../../../../../../../hooks/queries/useSessionTypeQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const DeleteSessionTypePage: NextPage = () => {
	const router = useRouter();
	const { eid, tid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { sessionType, isSessionTypeLoading, sessionTypeError } = useSessionTypeQuery(
		String(eid),
		String(tid)
	);
	const { deleteSessionTypeMutation } = useDeleteSessionTypeMutation(String(eid), String(tid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isSessionTypeLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isEventLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!sessionType) {
		return <NotFoundPage message="SessionType not found" />;
	}

	if (sessionTypeError) {
		return <ViewErrorPage errors={[sessionTypeError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete SessionType</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete a session type ("{sessionType.name}")
				</p>

				<h1 className="text-2xl md:text-3xl font-bold">Delete SessionType</h1>

				<DeleteSessionTypeForm
					sessionType={sessionType}
					isSessionTypeLoading={isSessionTypeLoading}
					sessionTypeError={sessionTypeError}
					deleteSessionTypeMutation={deleteSessionTypeMutation}
				/>
			</Column>
			<Footer />
		</PageWrapper>
	);
};

export default DeleteSessionTypePage;
