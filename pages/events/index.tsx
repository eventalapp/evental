import type { NextPage } from 'next';
import Head from 'next/head';
import { EventList } from '../../components/events/EventList';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import { useEventsQuery } from '../../hooks/queries/useEventsQuery';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';

const EventsPage: NextPage = () => {
	const { events, isEventsLoading, eventsError } = useEventsQuery();

	return (
		<PageWrapper variant="white">
			<Head>
				<title>All Events</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold mb-3">Upcoming Events</h1>

				<EventList events={events} eventsError={eventsError} isEventsLoading={isEventsLoading} />
			</Column>
		</PageWrapper>
	);
};

export default EventsPage;
