import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../../components/layout/Column';
import { EventList } from '../../components/events/EventList';
import { LinkButton } from '../../components/form/LinkButton';
import { Navigation } from '../../components/navigation';
import { useEventsQuery } from '../../hooks/queries/useEventsQuery';
import { FlexRowBetween } from '../../components/layout/FlexRowBetween';

const EventsPage: NextPage = () => {
	const { events, isEventsLoading } = useEventsQuery();

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
						<LinkButton>Create Event</LinkButton>
					</Link>
				</FlexRowBetween>

				<EventList events={events} loading={isEventsLoading} />
			</Column>
		</>
	);
};

export default EventsPage;
