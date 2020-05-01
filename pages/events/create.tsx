import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Column from '../../components/layout/Column';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { Navigation } from '../../components/navigation';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useImageUploadMutation } from '../../hooks/mutations/useImageUploadMutation';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { PasswordlessUser, ssrGetUser } from '../../utils/api';
import { useUser } from '../../hooks/queries/useUser';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const CreateEventPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { createEventMutation } = useCreateEventMutation();
	const { imageUploadMutation, imageUploadResponse } = useImageUploadMutation();
	const { user } = useUser(initialUser);

	console.log(user);

	if (!user?.id) {
		return <UnauthorizedPage />;
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
					createEventMutation={createEventMutation}
					imageUploadMutation={imageUploadMutation}
					imageUploadResponse={imageUploadResponse}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;

	return {
		props: {
			initialUser
		}
	};
};

export default CreateEventPage;
