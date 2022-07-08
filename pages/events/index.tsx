import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { NotFoundPage } from '../../components/error/NotFoundPage';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { useUpcomingEventsQuery } from '../../hooks/queries/useUpcomingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';

const EventsPage: NextPage = () => {
	const { upcomingEvents, upcomingEventsError } = useUpcomingEventsQuery();
	const { user } = useUser();

	if (upcomingEventsError) {
		return <NotFoundPage message="No Upcoming Events" />;
	}

	const Seo = (
		<NextSeo
			title="Upcoming Events — Evental"
			description="View all of the public upcoming events on evental.app."
			canonical="https://evental.app/events"
			openGraph={{
				url: 'https://evental.app/events',
				title: 'Upcoming Events',
				description: 'View all of the public upcoming events on evental.app.',
				images: [
					{
						url: 'https://cdn.evental.app/images/logo.jpg',
						width: 800,
						height: 600,
						alt: 'Evental Logo Alt',
						type: 'image/jpeg'
					}
				],
				site_name: 'Evental'
			}}
		/>
	);

	if (upcomingEvents && upcomingEvents.length === 0) {
		return (
			<PageWrapper>
				{Seo}

				<Navigation />

				<Column>
					<Heading className="text-center mb-4">Upcoming Events</Heading>

					{user && <EventsPageNavigation />}

					<span className="mt-5 block text-center text-base">
						No events found.{' '}
						<Link href="/events/create" passHref>
							<a className="mt-3 font-medium text-primary">Create an Event</a>
						</Link>
					</span>
				</Column>

				<Footer />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			{Seo}
			<Navigation />
			<Column>
				<Heading className="text-center mb-4">Upcoming Events</Heading>

				{user && <EventsPageNavigation />}

				<EventList events={upcomingEvents} hidePastEvents />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default EventsPage;
