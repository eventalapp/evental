import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { BackButton } from '../../components/BackButton';
import Column from '../../components/Column';
import { CreateEventForm } from '../../components/Form/Event/CreateEventForm';
import { Navigation } from '../../components/Navigation';
import Unauthorized from '../../components/Unauthorized';

const CreateEventPage: NextPage = () => {
	const session = useSession();

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

				<h1 className="text-3xl">Create Event Page</h1>

				<CreateEventForm />
			</Column>
		</>
	);
};

export default CreateEventPage;
