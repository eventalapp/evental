import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Column from '../../../components/Column';
import { Navigation } from '../../../components/Navigation';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data, isLoading } = useQuery<{ event: Prisma.Event; isOrganizer: boolean }, Error>(
		['event', eid],
		async () => {
			return axios.get(`/api/events/${eid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>{data?.event.location}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				{isLoading ? (
					<p>Loading</p>
				) : (
					<div>
						{data?.isOrganizer ? (
							<Link href={`/events/${eid}/admin`}>
								<a className="block bg-yellow-400 px-5 py-3 rounded-md mb-4">
									You are an organizer for this event, click here to manage this event
								</a>
							</Link>
						) : null}

						<p>{data?.event.id}</p>
						<h1 className="text-3xl">{data?.event.name}</h1>
						<p>{data?.event.location}</p>
						<p>{data?.event.description}</p>
						<Link href={`/events/${eid}/attendees`}>
							<a className="text-blue-900 p-3">View attendees</a>
						</Link>
						<Link href={`/events/${eid}/activities`}>
							<a className="text-blue-900 p-3">View activities</a>
						</Link>
					</div>
				)}
			</Column>
		</>
	);
};

export default ViewEventPage;
