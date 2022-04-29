import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import React from 'react';
import { UseActivityQueryData } from '../../hooks/queries/useActivityQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

type Props = {
	eid: string;
	aid: string;
} & UseActivityQueryData &
	UseOrganizerQueryData;

export const ViewActivity: React.FC<Props> = (props) => {
	const { activity, isOrganizerLoading, isOrganizer, aid, eid } = props;

	if (!activity) return null;

	return (
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
			<p>{activity.endDate.toString()}</p>
			<div className="flex flex-row items-center mb-1">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faLocationDot}
				/>
				<p>{activity?.venueId}</p>
			</div>

			<div className="flex flex-row items-center">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faCalendarDay}
				/>
				<p>
					{format(new Date(activity.startDate), 'MMMM dd')} -{' '}
					{format(new Date(activity.endDate), 'MMMM dd')}
				</p>
			</div>
		</div>
	);
};
