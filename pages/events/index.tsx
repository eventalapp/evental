import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Column from '../../components/Column';

const EventsPage: NextPage = () => {
	const { data, isLoading } = useQuery<Prisma.Event[], Error>(['events'], async () => {
		return axios.get(`/api/events`).then((res) => res.data);
	});

	return (
		<Column className="py-10">
			<Head>
				<title>All Events</title>
			</Head>

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
	);
};

export default EventsPage;
