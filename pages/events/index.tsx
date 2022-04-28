import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { EventList } from '../../components/events/EventList';
import { LinkButton } from '../../components/form/LinkButton';
import Column from '../../components/layout/Column';
import { FlexRowBetween } from '../../components/layout/FlexRowBetween';
import { Navigation } from '../../components/navigation';
import { useEventsQuery } from '../../hooks/queries/useEventsQuery';

const EventsPage: NextPage = () => {
	const { events, isEventsLoading, eventsError } = useEventsQuery();

	return (
		<>
			<Head>
				<title>All Events</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Event Page</h1>

					<Link href="/events/create" passHref>
						<LinkButton variant="gradient">Create Event</LinkButton>
					</Link>
				</FlexRowBetween>

				<EventList events={events} eventsError={eventsError} isEventsLoading={isEventsLoading} />
			</Column>
		</>
	);
};

export default EventsPage;
