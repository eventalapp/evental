import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/layout/Column';
import { CreateVenueForm } from '../../../../../components/venues/CreateVenueForm';
import { Navigation } from '../../../../../components/navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useCreateVenueMutation } from '../../../../../hooks/mutations/useCreateVenueMutation';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { createVenueMutation, createVenueError } = useCreateVenueMutation(String(eid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton />

				<h1 className="text-3xl">Create Venue Page</h1>

				<CreateVenueForm
					createVenueError={createVenueError}
					createVenueMutation={createVenueMutation}
				/>
			</Column>
		</>
	);
};

export default CreateActivityPage;
