import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeleteSessionForm } from '../../../../../../components/sessions/DeleteSessionForm';
import { useDeleteSessionMutation } from '../../../../../../hooks/mutations/useDeleteSessionMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeleteSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { deleteSessionMutation } = useDeleteSessionMutation(String(eid), String(sid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isSessionLoading || isUserLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!session) {
		return <NotFoundPage message="Session not found" />;
	}

	if (sessionError) {
		return <ViewErrorPage errors={[sessionError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Session</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-medium">
					You are about to delete an session ("{session.name}")
				</p>

				<h1 className="text-2xl md:text-3xl font-bold">Delete Session</h1>

				<DeleteSessionForm
					session={session}
					isSessionLoading={isSessionLoading}
					sessionError={sessionError}
					deleteSessionMutation={deleteSessionMutation}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default DeleteSessionPage;
