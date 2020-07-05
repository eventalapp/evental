import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

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
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { useOrganizingEventsQuery } from '../../hooks/queries/useOrganizingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';

const OrganizingEventsPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { organizingEventsError, organizingEvents } = useOrganizingEventsQuery(String(user?.id));
	const { createEventMutation } = useCreateEventMutation();

	if (organizingEventsError) {
		return <ViewErrorPage errors={[organizingEventsError]} />;
	}

	if (!user && !isUserLoading) {
		return <UnauthorizedPage />;
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
				<Heading className="text-center mb-4">Organizing Events</Heading>

				<EventsPageNavigation />

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

export default OrganizingEventsPage;
