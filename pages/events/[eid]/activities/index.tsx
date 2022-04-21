import type Prisma from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import { groupByDate } from '../../../../utils/groupByDate';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { data: activities, isLoading } = useQuery<Prisma.EventActivity[], Error>(
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

	if (activities) {
		groupByDate(activities);
	}

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
					<div>
						{activities &&
							Object.entries(groupByDate(activities)).map(([key, activityDate]) => {
								return (
									<div key={key}>
										<h2 className="text-2xl">{dayjs(key).format('dddd, MMMM D')}</h2>
										{Object.entries(activityDate).map(([key, activitiesByDate]) => {
											return (
												<li key={key}>
													<h2 className="font-bold text-1xl">{dayjs(key).format('h:mma')}</h2>
													<ul>
														{activitiesByDate.map((activity) => (
															<li key={activity.id}>
																<Link href={`/events/${eid}/activities/${activity.id}`}>
																	<a>
																		<span>
																			{dayjs(activity.startDate).format('h:mma')} {activity.name} -{' '}
																			{activity.description}
																		</span>
																	</a>
																</Link>
															</li>
														))}
													</ul>
												</li>
											);
										})}
									</div>
								);
							})}
					</div>
				)}
			</Column>
		</>
	);
};

export default ActivitiesPage;
