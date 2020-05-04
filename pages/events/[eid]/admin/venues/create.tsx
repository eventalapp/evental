import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../../components/navigation';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';
import { useCreateVenueMutation } from '../../../../../hooks/mutations/useCreateVenueMutation';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useUser } from '../../../../../hooks/queries/useUser';
import { LoadingPage } from '../../../../../components/error/LoadingPage';

const CreateSessionPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createVenueMutation } = useCreateVenueMutation(String(eid));
	const { user, isUserLoading } = useUser();

	if (isOrganizerLoading || isUserLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<h1 className="text-3xl font-bold">Create Venue</h1>

				<CreateVenueForm createVenueMutation={createVenueMutation} eid={String(eid)} />
			</Column>
		</PageWrapper>
	);
};

export default CreateSessionPage;
