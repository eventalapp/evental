import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/Column';
import { Navigation } from '../../../../../../components/Navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditVenueForm } from '../../../../../../components/Venues/EditVenueForm';

const EditVenuePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, vid } = router.query;
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
				<title>Edit Venue</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Edit Venue Page</h1>

				<EditVenueForm eid={String(eid)} vid={String(vid)} />
			</Column>
		</>
	);
};

export default EditVenuePage;
