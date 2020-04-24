import dayjs from 'dayjs';
import Link from 'next/link';
import { groupByDate } from '../../utils/groupByDate';
import React from 'react';
import { UseActivitiesQueryData } from '../../hooks/queries/useActivitiesQuery';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
} & UseActivitiesQueryData;

export const ActivityList: React.FC<Props> = (props) => {
	const { eid, isActivitiesLoading, activitiesError, activities } = props;

	if (isActivitiesLoading) {
		return <Loading />;
	}

	if (activitiesError) {
		return <ServerError errors={[activitiesError]} />;
	}

	if (!activities || activities?.length === 0) {
		return <NotFound />;
	}

	return (
		<div>
			{Object.entries(groupByDate(activities)).map(([key, activityDate]) => {
				return (
					<div key={key}>
						<h2 className="text-2xl border-b-2 border-gray-200 mt-4 pb-2">
							{dayjs(key).format('dddd, MMMM D')}
						</h2>
						{Object.entries(activityDate).map(([key, activitiesByDate]) => {
							return (
								<div key={key} className="flex flex-row">
									<h2 className="font-bold text-1xl w-24 py-2 border-b-2 text-center">
										{dayjs(key).format('h:mma')}
									</h2>
									<div className="border-l-2 border-gray-200 inline-block pl-3">
										{activitiesByDate.map((activity) => (
											<div key={activity.id}>
												<Link href={`/events/${eid}/activities/${activity.slug}`}>
													<a className="py-2 flex flex-row items-center">
														<div className="rounded-full mr-3 w-3 h-3 bg-red-300" />
														<div>
															<span className="text-xl">{activity.name}</span>
															<span className="block text-md">{activity.description}</span>
														</div>
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
	);
};
