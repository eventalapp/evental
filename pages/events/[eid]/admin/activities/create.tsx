import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../components/layout/Column';
import { CreateActivityForm } from '../../../../../components/activities/CreateActivityForm';
import { Navigation } from '../../../../../components/navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/queries/useVenuesQuery';
import { useCreateActivityMutation } from '../../../../../hooks/mutations/useCreateActivityMutation';
import React from 'react';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));
	const { createActivityError, createActivityMutation } = useCreateActivityMutation(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Create Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Create Activity Page</h1>

				<CreateActivityForm
					eid={String(eid)}
					venues={venues}
					venuesError={venuesError}
					isVenuesLoading={isVenuesLoading}
					createActivityError={createActivityError}
					createActivityMutation={createActivityMutation}
				/>
			</Column>
		</>
	);
};

export default CreateActivityPage;
