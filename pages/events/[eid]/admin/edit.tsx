import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { EditEventForm } from '../../../../components/Form/Event/EditEventForm';
import { Navigation } from '../../../../components/Navigation';
import Unauthorized from '../../../../components/Unauthorized';

const CreateEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Update Event Page</h1>

				<EditEventForm eid={String(eid)} />
			</Column>
		</>
	);
};

export default CreateEventPage;
