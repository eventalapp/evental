import type Prisma from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
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
				<div className="flex flex-row justify-between w-full mb-3">
					<h1 className="text-3xl font-bold">Event Page</h1>

					<Link href="/events/create">
						<a className="bg-blue-900 px-3 py-2 text-white rounded-lg">Create Event</a>
					</Link>
				</div>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{data?.map((event) => (
							<li key={event.id} className="bg-gray-200 rounded-lg mb-3 px-3 py-3">
								<Link href={`/events/${event.id}`}>
									<a>
										<div className="flex flex-row ">
											<div className="flex flex-col align-center justify-center mr-5">
												<span className="text-gray-800 text-center inline">
													{dayjs(event.startDate).format('MMM DD')}
													<br />
													{dayjs(event.endDate).format('MMM DD')}
												</span>
											</div>
											<div className="bg-yellow-500  mr-5">fs</div>
											<div className="flex flex-col justify-between">
												<span className="text-gray-600 text-sm block">Festival</span>
												<span className="text-xl mr-3">{event.name}</span>
												<span className="block">{event.description}</span>
											</div>
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
