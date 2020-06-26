import type Prisma from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../../components/Footer';
import { LoadingPage } from '../../components/error/LoadingPage';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { useOrganizingEventsQuery } from '../../hooks/queries/useOrganizingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';
import { ssrGetUser } from '../../utils/api';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getOrganizingEvents } from '../api/events/organizing';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialOrganizingEvents: Prisma.Event[];
};

const OrganizingEventsPage: NextPage<Props> = (props) => {
	const { initialOrganizingEvents, initialUser } = props;
	const { organizingEventsError, isOrganizingEventsLoading, organizingEvents } =
		useOrganizingEventsQuery(String(initialUser?.id), initialOrganizingEvents);
	const { user } = useUser(initialUser);
	const { createEventMutation } = useCreateEventMutation();

	if (isOrganizingEventsLoading) {
		return <LoadingPage />;
	}

	if (organizingEventsError) {
		return <ViewErrorPage errors={[organizingEventsError]} />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!organizingEvents) {
		return <NotFoundPage message="You are not organizing any events" />;
	}

	if (organizingEvents.length === 0) {
		return (
			<PageWrapper>
				<NextSeo
					title="Organizing Events — Evental"
					description="View all of the events you are organizing."
					openGraph={{
						url: 'https://evental.app/events/organizing',
						title: 'Organizing Events',
						description: 'View all of the events you are organizing.',
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
					<Heading>Organizing Events</Heading>

					<EventsPageNavigation />

					<span className="mt-5 block text-center text-lg font-bold">
						Organizing an event? Create an event below
					</span>

					<CreateEventForm createEventMutation={createEventMutation} />
				</Column>

				<Footer />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<NextSeo
				title="Organizing Events — Evental"
				description="View all of the events you are organizing."
				openGraph={{
					url: 'https://evental.app/events/organizing',
					title: 'Organizing Events',
					description: 'View all of the events you are organizing.',
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
				<h1 className="mb-3 text-center text-2xl font-bold md:text-3xl">Organizing Events</h1>

				{user && <EventsPageNavigation />}

				<span className="mt-5 block text-center text-lg font-medium">
					Organizing an event? Create an event below
				</span>

				<CreateEventForm createEventMutation={createEventMutation} />

				<EventList events={organizingEvents} className="mt-5" />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizingEvents = await getOrganizingEvents(String(initialUser?.id));

	return {
		props: { initialOrganizingEvents, initialUser }
	};
};

export default OrganizingEventsPage;
