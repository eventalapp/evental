import type Prisma from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { groupByDate } from '../../utils/groupByDate';
import React from 'react';

interface Props {
	loading: boolean;
	activities: Prisma.EventActivity[] | undefined;
	eid: string;
}

export const ActivityList: React.FC<Props> = (props) => {
	const { eid, loading, activities } = props;

	if (loading) {
		return (
			<div>
				<p>Activities loading...</p>
			</div>
		);
	}

	if (activities?.length === 0) {
		return (
			<div>
				<p>No activities found.</p>
			</div>
		);
	}

	return (
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
