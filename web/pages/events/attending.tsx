import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { useAttendingEvents, useUser } from '@eventalapp/shared/hooks';

import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';

const AttendingEventsPage: NextPage = () => {
	const { data: user, isLoading: isUserLoading } = useUser();
	const { error: attendingEventsError, data: attendingEvents } = useAttendingEvents();

	if (attendingEventsError) {
		return <ViewErrorPage errors={[attendingEventsError]} />;
	}

	if (!user && !isUserLoading) {
		return <UnauthorizedPage />;
	}

	const Seo = (
		<NextSeo
			title="Attending Events — Evental"
			description="View all of the events you are attending."
			openGraph={{
				url: 'https://evental.app/events/attending',
				title: 'Attending Events',
				description: 'View all of the events you are attending.',
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

	if (attendingEvents && attendingEvents.length === 0) {
		return (
			<>
				{Seo}

				<Navigation />

				<PageWrapper>
					<Column>
						<Heading className="mb-4 text-center">Attending Events</Heading>

						<EventsPageNavigation />

						<span className="mt-5 block text-center text-base">
							You are not attending any events.{' '}
							<Link href="/events" passHref>
								<a className="mt-3 font-medium text-primary">Find Events</a>
							</Link>
						</span>
					</Column>
				</PageWrapper>

				<Footer />
			</>
		);
	}

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column>
					<Heading className="mb-4 text-center">Attending Events</Heading>

					<EventsPageNavigation />

					<EventList events={attendingEvents} />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default AttendingEventsPage;
