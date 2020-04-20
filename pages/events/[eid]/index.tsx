import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Column from '../../../components/Column';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data, isLoading } = useQuery<Prisma.Event, Error>(
		['event', eid],
		async () => {
			return axios.get(`/api/events/${eid}`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return (
		<Column className="py-10">
			<Head>
				<title>{data?.location}</title>
			</Head>

			{isLoading ? (
				<p>Loading</p>
			) : (
				<div>
					<p>{data?.id}</p>
					<h1 className="text-3xl">{data?.name}</h1>
					<p>{data?.location}</p>
					<p>{data?.description}</p>

					<Link href={`/events/${eid}/attendees`}>
						<a className="text-blue-900 p-3">View attendees</a>
					</Link>
					<Link href={`/events/${eid}/activities`}>
						<a className="text-blue-900 p-3">View activities</a>
					</Link>
				</div>
			)}
		</Column>
	);
};

export default ViewEventPage;
