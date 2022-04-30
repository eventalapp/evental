import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { EventList } from '../../components/events/EventList';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import { useEventsQuery } from '../../hooks/queries/useEventsQuery';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import type Prisma from '@prisma/client';
import { getEvents } from '../api/events';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { ViewServerErrorPage } from '../../components/error/ViewServerErrorPage';
import { LoadingPage } from '../../components/error/LoadingPage';

type Props = {
	initialEvents: Prisma.Event[];
};

const EventsPage: NextPage<Props> = (props) => {
	const { initialEvents } = props;
	const { events, isEventsLoading, eventsError } = useEventsQuery(initialEvents);

	if (isEventsLoading) {
		return <LoadingPage />;
	}

	if (eventsError) {
		return <ViewServerErrorPage errors={[eventsError]} />;
	}

	if (!events || !events.length) {
		return <NotFoundPage message="No events found." />;
	}

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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const initialEvents = await getEvents();

	return {
		props: { initialEvents }
	};
};

export default EventsPage;
