import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { useOrganizingEvents, useUser } from '@eventalapp/shared/hooks';

import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { useCreateEvent } from '../../hooks/mutations/useCreateEvent';

const OrganizingEventsPage: NextPage = () => {
	const { data: user, isLoading: isUserLoading } = useUser();
	const { error: organizingEventsError, data: organizingEvents } = useOrganizingEvents();
	const { createEventMutation } = useCreateEvent();

	if (organizingEventsError) {
		return <ViewErrorPage errors={[organizingEventsError]} />;
	}

	if (!user && !isUserLoading) {
		return <UnauthorizedPage />;
	}

	const Seo = (
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
	);

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column>
					<Heading className="mb-4 text-center">Organizing Events</Heading>

					<EventsPageNavigation />

					<span className="mt-5 block text-center text-lg font-medium">
						Organizing an event? Create an event below
					</span>

					<CreateEventForm createEventMutation={createEventMutation} />

					<EventList events={organizingEvents} className="mt-5" />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default OrganizingEventsPage;
