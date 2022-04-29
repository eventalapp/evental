import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Column from '../../components/layout/Column';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { Navigation } from '../../components/navigation';
import Unauthorized from '../../components/error/Unauthorized';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import React, { useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Session } from 'next-auth';
import { toast } from 'react-toastify';

type Props = {
	session: Session | null;
};

const CreateEventPage: NextPage<Props> = (props) => {
	const { session } = props;
	const { createEventMutation, createEventError } = useCreateEventMutation();

	useEffect(() => {
		toast.error(createEventError?.message);
	}, [createEventError]);

	if (!session?.user?.id) {
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const session = await getSession(context);

	return {
		props: {
			session
		}
	};
};

export default CreateEventPage;
