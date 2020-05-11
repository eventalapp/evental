import type { GetServerSideProps, NextPage } from 'next';
import { EventList } from '../../components/events/EventList';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import type Prisma from '@prisma/client';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import { ssrGetUser } from '../../utils/api';
import { useOrganizingEventsQuery } from '../../hooks/queries/useOrganizingEventsQuery';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getOrganizingEvents } from '../api/events/organizing';
import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { NextSeo } from 'next-seo';

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
			<PageWrapper variant="white">
				<NextSeo
					title="Organizing Events"
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
					<h1 className="text-2xl md:text-3xl font-bold mb-3">Organizing Events</h1>

					<EventsPageNavigation />

					<span className="block font-bold text-center text-lg mt-5">Organizing an event?</span>

					<CreateEventForm createEventMutation={createEventMutation} />
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Organizing Events"
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
				<h1 className="text-2xl md:text-3xl font-bold mb-3">Organizing Events</h1>

				{user && <EventsPageNavigation />}

				<span className="block font-bold text-center text-lg mt-5">Organizing an event?</span>

				<CreateEventForm createEventMutation={createEventMutation} />

				<EventList events={organizingEvents} className="mt-5" />
			</Column>
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
