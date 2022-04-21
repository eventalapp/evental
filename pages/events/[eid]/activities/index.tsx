import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data, isLoading } = useQuery<Prisma.EventActivity[], Error>(
		['activities', eid],
		async () => {
			return axios.get(`/api/events/${eid}/activities`).then((res) => res.data);
		},
		{
			enabled: eid !== undefined
		}
	);

	return (
		<>
			<Head>
				<title>All Activities</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<Link href={`/events/${eid}`}>
					<a className="text-blue-900">Back to event</a>
				</Link>
				<h1 className="text-3xl">Activities Page</h1>

				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{data &&
							data.map((activity) => (
								<li key={activity.id}>
									<Link href={`/events/${eid}/activities/${activity.id}`}>
										<a>
											<span>
												{activity.name} - {activity.description}
											</span>
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

export default ActivitiesPage;
