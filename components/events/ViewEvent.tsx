import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import dayjs from 'dayjs';
import { capitalizeFirstLetter } from '../../utils/string';
import { ActivityList } from '../activities/ActivityList';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseActivitiesQueryData } from '../../hooks/queries/useActivitiesQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
} & UseOrganizerQueryData &
	UseEventQueryData &
	UseActivitiesQueryData &
	UseRolesQueryData;

export const ViewEvent: React.FC<Props> = (props) => {
	const {
		eid,
		event,
		activities,
		roles,
		isOrganizer,
		isOrganizerLoading,
		eventError,
		isEventLoading,
		isActivitiesLoading,
		activitiesError,
		isOrganizerError,
		rolesError,
		isRolesLoading
	} = props;

	if (rolesError || isEventLoading || isOrganizerLoading || isActivitiesLoading || isRolesLoading) {
		return <Loading />;
	}

	if (isOrganizerError || rolesError || eventError || activitiesError) {
		return <ServerError errors={[isOrganizerError, rolesError, eventError, activitiesError]} />;
	}

	if (!event) {
		return <NotFound />;
	}

	return (
		<div>
			{isOrganizer && (
				<Link href={`/events/${eid}/admin`}>
					<a className="block text-white bg-primary px-5 py-3 rounded-md mb-4">
						You are an organizer for this event, click here to manage this event
					</a>
				</Link>
			)}
			<span className="text-gray-600 text-sm block">{event?.type}</span>
			<h1 className="text-3xl font-bold">{event?.name}</h1>
			<p>{event?.location}</p>
			<p>{event?.description}</p>
			{dayjs(event?.startDate).format('MMM DD')} - {dayjs(event?.endDate).format('MMM DD')}
			<div>
				{roles &&
					roles.map((role) => (
						<Link href={`/events/${eid}/roles/${role.slug}`} passHref key={role.id}>
							<LinkButton className="mr-3 mt-3">
								{capitalizeFirstLetter(role.name.toLowerCase())}s
							</LinkButton>
						</Link>
					))}

				<Link href={`/events/${eid}/venues`} passHref>
					<LinkButton className="mt-3">Venues</LinkButton>
				</Link>
			</div>
			<ActivityList
				isOrganizer={isOrganizer}
				isOrganizerLoading={isOrganizerLoading}
				isOrganizerError={isOrganizerError}
				activities={activities}
				eid={String(eid)}
				activitiesError={activitiesError}
				isActivitiesLoading={isActivitiesLoading}
			/>
		</div>
	);
};
