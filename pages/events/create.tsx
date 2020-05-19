import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Column from '../../components/layout/Column';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { Navigation } from '../../components/navigation';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ssrGetUser } from '../../utils/api';
import { useUser } from '../../hooks/queries/useUser';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { NextSeo } from 'next-seo';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const CreateEventPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { createEventMutation } = useCreateEventMutation();
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title="Create Event — Evental"
				description="Fill out the form to create an event."
				openGraph={{
					url: 'https://evental.app/events/create',
					title: 'Create Event',
					description: 'Fill out the form to create an event.',
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<Navigation />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold">Create an Event</h1>

				<p className="mt-2">
					Create and setup a private event, invite organizers, customize your event, create
					sessions, attendees, pages, and more.
				</p>

				<CreateEventForm createEventMutation={createEventMutation} canCancel />
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
