import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { EventList } from '../../components/events/EventList';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';
import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import type Prisma from '@prisma/client';
import { getUpcomingEvents } from '../api/events';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { LoadingPage } from '../../components/error/LoadingPage';
import { ssrGetUser } from '../../utils/api';
import { useUpcomingEventsQuery } from '../../hooks/queries/useUpcomingEventsQuery';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { useUser } from '../../hooks/queries/useUser';
import Link from 'next/link';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialUpcomingEvents: Prisma.Event[];
};

const EventsPage: NextPage<Props> = (props) => {
	const { initialUpcomingEvents, initialUser } = props;
	const { upcomingEvents, upcomingEventsError, isUpcomingEventsLoading } =
		useUpcomingEventsQuery(initialUpcomingEvents);
	const { user } = useUser(initialUser);

	if (isUpcomingEventsLoading) {
		return <LoadingPage />;
	}

	if (upcomingEventsError) {
		return <ViewErrorPage errors={[upcomingEventsError]} />;
	}

	if (!upcomingEvents) {
		return <NotFoundPage message="No Upcoming Events" />;
	}

	if (upcomingEvents.length === 0) {
		return (
			<PageWrapper variant="white">
				<Head>
					<title>Upcoming Events</title>
				</Head>

				<Navigation />

				<Column>
					<h1 className="text-2xl md:text-3xl font-bold mb-3">Upcoming Events</h1>

					{user && <EventsPageNavigation />}

					<span className="block text-base mt-5">
						No events found.{' '}
						<Link href="/events/create" passHref>
							<a className="mt-3 text-primary font-bold">Create an Event</a>
						</Link>
					</span>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="white">
			<Head>
				<title>Upcoming Events</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-2xl md:text-3xl font-bold mb-3">Upcoming Events</h1>

				{user && <EventsPageNavigation />}

				<EventList events={upcomingEvents} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialUpcomingEvents = await getUpcomingEvents();

	return {
		props: { initialUpcomingEvents, initialUser }
	};
};

export default EventsPage;
