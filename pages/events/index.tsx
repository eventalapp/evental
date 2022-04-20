import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Column from '../../components/Column';
import { Navigation } from '../../components/Navigation';

const EventsPage: NextPage = () => {
	const { data, isLoading } = useQuery<Prisma.Event[], Error>(['events'], async () => {
		return axios.get(`/api/events`).then((res) => res.data);
	});

	return (
		<>
			<Head>
				<title>All Events</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href="/events/create">
					<a className="text-blue-900 p-3">Create Event</a>
				</Link>
				<h1 className="text-3xl">Event Page</h1>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{data?.map((event) => (
							<li key={event.id}>
								<Link href={`/events/${event.id}`}>
									<a>
										<div>
											{event.name} - {event.description} - {event.startDate} - {event.endDate}
										</div>
									</a>
								</Link>
							</li>
						))}
					</ul>
				)}
			</Column>
		</>
	);
};

export default EventsPage;
