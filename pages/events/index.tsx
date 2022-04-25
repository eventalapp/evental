import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Column from '../../components/Column';
import { EventList } from '../../components/Events/EventList';
import { LinkButton } from '../../components/Form/LinkButton';
import { Navigation } from '../../components/Navigation';
import { useEventsQuery } from '../../hooks/queries/useEventsQuery';

const EventsPage: NextPage = () => {
	const { events, isEventsLoading } = useEventsQuery();

	return (
		<>
			<Head>
				<title>All Events</title>
			</Head>

			<Navigation />

			<Column>
				<div className="flex flex-row justify-between w-full mb-3">
					<h1 className="text-3xl font-bold">Event Page</h1>

					<Link href="/events/create" passHref>
						<LinkButton>Create Event</LinkButton>
					</Link>
				</div>

				<EventList events={events} loading={isEventsLoading} />
			</Column>
		</>
	);
};

export default EventsPage;
