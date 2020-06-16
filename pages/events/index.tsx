import type Prisma from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../../components/Footer';
import { LoadingPage } from '../../components/error/LoadingPage';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { useUpcomingEventsQuery } from '../../hooks/queries/useUpcomingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';
import { ssrGetUser } from '../../utils/api';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getUpcomingEvents } from '../api/events';

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
			<PageWrapper>
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

				<Navigation />

				<Column>
					<h1 className="mb-3 text-center text-2xl font-bold md:text-3xl">Upcoming Events</h1>

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
			<NextSeo
				title="Upcoming Events — Evental"
				description="View all of the public upcoming events on evental.app."
				openGraph={{
					url: 'https://evental.app/events',
					title: 'Upcoming Events',
					description: 'View all of the public upcoming events on evental.app.',
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
				<h1 className="mb-3 text-center text-2xl font-bold md:text-3xl">Upcoming Events</h1>

				{user && <EventsPageNavigation />}

				<EventList events={upcomingEvents} />
			</Column>

			<Footer />
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
