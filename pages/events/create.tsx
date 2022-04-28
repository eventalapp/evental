import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Column from '../../components/layout/Column';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { Navigation } from '../../components/navigation';
import Unauthorized from '../../components/Unauthorized';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';

const CreateEventPage: NextPage = () => {
	const session = useSession();
	const { createEventMutation, createEventError } = useCreateEventMutation();

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Create an Event</h1>

				<CreateEventForm
					createEventError={createEventError}
					createEventMutation={createEventMutation}
				/>
			</Column>
		</PageWrapper>
	);
};

export default CreateEventPage;
