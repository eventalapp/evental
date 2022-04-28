import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import React from 'react';
import { UseActivityQueryData } from '../../hooks/queries/useActivityQuery';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = {
	eid: string;
	aid: string;
} & UseActivityQueryData &
	UseOrganizerQueryData;

export const ViewActivity: React.FC<Props> = (props) => {
	const {
		activity,
		isActivityLoading,
		activityError,
		isOrganizerError,
		isOrganizerLoading,
		isOrganizer,
		aid,
		eid
	} = props;

	if (isOrganizerLoading || isActivityLoading) {
		return <Loading />;
	}

	if (isOrganizerError || activityError) {
		return <ViewServerError errors={[isOrganizerError, activityError]} />;
	}

	if (!activity) {
		return <NotFound />;
	}

	return (
		<div>
			<div>
				<FlexRowBetween>
					<h1 className="text-3xl">{activity.name}</h1>

					<div>
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/activities/${aid}/edit`} passHref>
								<LinkButton className="mr-3">Edit activity</LinkButton>
							</Link>
						)}
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/activities/${aid}/delete`} passHref>
								<LinkButton className="mr-3">Delete activity</LinkButton>
							</Link>
						)}
					</div>
				</FlexRowBetween>
				<p>{activity.description}</p>
				<p>{activity.startDate.toString()}</p>
				<p>{activity.endDate.toString()}</p>
			</div>
		</div>
	);
};
