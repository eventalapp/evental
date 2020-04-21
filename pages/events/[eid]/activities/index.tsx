import type Prisma from '@prisma/client';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
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
	const { data: organizer } = useQuery<{ isOrganizer: boolean }, Error>(
		['isOrganizer', eid],
		async () => {
			return axios.get(`/api/events/${eid}/admin/organizer`).then((res) => res.data);
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
				<BackButton />

				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">Activities Page</h1>
					{organizer?.isOrganizer && (
						<Link href={`/events/${eid}/admin/activities/create`} passHref>
							<LinkButton>Create Activity</LinkButton>
						</Link>
					)}
				</div>

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
