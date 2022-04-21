import type Prisma from '@prisma/client';
import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Column from '../../components/Column';
import { LinkButton } from '../../components/Form/LinkButton';
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

					<Link href="/events/create" passHref>
						<LinkButton>Create Event</LinkButton>
					</Link>
				</div>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{data &&
							data.map((event, i) => (
								<li
									key={event.id}
									className={classNames(
										'hover:bg-gray-100 border-gray-200',
										i + 1 !== data.length ? 'border-b-2' : null
									)}
								>
									<Link href={`/events/${event.id}`}>
										<a className="px-3 py-3 block">
											<div className="flex flex-row items-center">
												<div className="flex flex-col align-center justify-center mr-5">
													<span className="text-gray-800 text-center inline">
														{dayjs(event.startDate).format('MMM DD')}
														<br />
														{dayjs(event.endDate).format('MMM DD')}
													</span>
												</div>

												<div className="mr-5 relative w-14 h-14 rounded-md">
													{event.image ? (
														<Image
															alt={event.name}
															src={String(event.image)}
															layout="fill"
															className="rounded-md"
														/>
													) : (
														<div className="bg-yellow-400 rounded-md h-full"></div>
													)}
												</div>

												<div className="flex flex-col justify-between">
													<span className="text-gray-600 text-sm block">{event.type}</span>
													<span className="text-xl mr-3">{event.name}</span>
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
