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
										<h2 className="text-2xl border-b-2 border-gray-200 mt-4 pb-2">
											{dayjs(key).format('dddd, MMMM D')}
										</h2>
										{Object.entries(activityDate).map(([key, activitiesByDate]) => {
											return (
												<div key={key} className="flex flex-row">
													<h2 className="font-bold text-1xl w-24 py-2 border-b-2">
														{dayjs(key).format('h:mma')}
													</h2>
													<div className="border-l-2 border-gray-200 inline-block pl-3">
														{activitiesByDate.map((activity) => (
															<div key={activity.id}>
																<Link href={`/events/${eid}/activities/${activity.id}`}>
																	<a className="py-2 block">
																		<span>
																			{dayjs(activity.startDate).format('h:mma')} {activity.name} -{' '}
																			{activity.description}
																		</span>
																	</a>
																</Link>
															</div>
														))}
													</div>
												</div>
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
