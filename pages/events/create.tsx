import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { BackButton } from '../../components/BackButton';
import Column from '../../components/Column';
import { CreateEventForm } from '../../components/Events/CreateEventForm';
import { Navigation } from '../../components/Navigation';
import Unauthorized from '../../components/Unauthorized';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';

const CreateEventPage: NextPage = () => {
	const session = useSession();
	const { createEventMutation, createEventError } = useCreateEventMutation();

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

				<CreateEventForm
					createEventError={createEventError}
					createEventMutation={createEventMutation}
				/>
			</Column>
		</>
	);
};

export default CreateEventPage;
