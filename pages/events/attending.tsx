import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../../components/Footer';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useAttendingEventsQuery } from '../../hooks/queries/useAttendingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';

const AttendingEventsPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { attendingEventsError, attendingEvents } = useAttendingEventsQuery(String(user?.id));

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
			<PageWrapper>
				{Seo}

				<Navigation />

				<Column>
					<Heading className="text-center mb-4">Attending Events</Heading>

					{user && <EventsPageNavigation />}

					<span className="mt-5 block text-center text-base">
						You are not attending any events.{' '}
						<Link href="/events" passHref>
							<a className="mt-3 font-medium text-primary">Find Events</a>
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
				<Heading className="text-center mb-4">Attending Events</Heading>

				<EventsPageNavigation />

				<EventList events={attendingEvents} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default AttendingEventsPage;
