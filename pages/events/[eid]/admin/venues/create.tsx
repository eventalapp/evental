import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { CreateVenueForm } from '../../../../../components/Form/Venue/CreateVenueForm';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

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

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Create Venue Page</h1>

				<CreateVenueForm eid={String(eid)} />
			</Column>
		</>
	);
};

export default CreateActivityPage;
