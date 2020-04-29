import Link from 'next/link';
import { groupByDate } from '../../utils/groupByDate';
import React from 'react';
import { UseActivitiesQueryData } from '../../hooks/queries/useActivitiesQuery';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { format } from 'date-fns';
import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
} & UseActivitiesQueryData &
	UseOrganizerQueryData;

export const ActivityList: React.FC<Props> = (props) => {
	const { eid, activities, isOrganizerLoading, isOrganizer } = props;

	if (activities && activities?.length === 0) {
		return <NotFound message="No activities found." />;
	}

	if (!activities) return null;

	return (
		<div>
			{Object.entries(groupByDate(activities)).map(([key, activityDate]) => {
				return (
					<div key={key}>
						<h2 className="text-2xl border-gray-200 mt-4 pb-2">
							{format(new Date(key), 'EEEE, MMMM d')}
						</h2>
						{Object.entries(activityDate).map(([key, activitiesByDate]) => {
							return (
								<div key={key} className="flex flex-row flex-wrap">
									<span className="text-gray-700 text-sm w-20 py-2 pr-3 text-right">
										{format(new Date(key), 'h:mm a OOO')}
									</span>

									<div className="flex-grow">
										{activitiesByDate.map((activity) => (
											<div
												key={activity.id}
												className="py-2 flex flex-row justify-between flex-grow border-l-2 border-gray-200 pl-3"
											>
												<div className="flex flex-row items-center justify-between">
													<div className="rounded-full mr-3 w-3 h-3 bg-gradient-to-r from-secondary-500 to-primary-500" />
													<div>
														<span className="text-xl">{activity.name}</span>
													</div>
												</div>

												<div className="flex flex-row items-center">
													<Link href={`/events/${eid}/activities/${activity.slug}`} passHref>
														<LinkButton variant="primary">View</LinkButton>
													</Link>
													{!isOrganizerLoading && isOrganizer && (
														<Link
															href={`/events/${eid}/admin/activities/${activity.slug}/edit`}
															passHref
														>
															<LinkButton variant="primary" className="ml-3">
																Edit
															</LinkButton>
														</Link>
													)}
													{!isOrganizerLoading && isOrganizer && (
														<Link
															href={`/events/${eid}/admin/activities/${activity.slug}/delete`}
															passHref
														>
															<LinkButton variant="primary" className="ml-3">
																Delete
															</LinkButton>
														</Link>
													)}
												</div>
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
