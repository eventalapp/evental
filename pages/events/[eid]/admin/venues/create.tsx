import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';
import { useCreateVenueMutation } from '../../../../../hooks/mutations/useCreateVenueMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createVenueMutation } = useCreateVenueMutation(String(eid), { redirect: true });
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isOrganizerLoading || isUserLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Create event</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h3 className="text-xl md:text-2xl font-medium">Create Venue</h3>

				<CreateVenueForm createVenueMutation={createVenueMutation} eid={String(eid)} />
			</Column>
		</PageWrapper>
	);
};

export default CreateSessionPage;
