import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { capitalizeFirstLetter } from '../../utils/string';
import { SessionList } from '../sessions/SessionList';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseSessionsQueryData } from '../../hooks/queries/useSessionsQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';

type Props = {
	eid: string;
} & UseOrganizerQueryData &
	UseEventQueryData &
	UseSessionsQueryData &
	UseRolesQueryData &
	UseAttendeeQueryData;

export const ViewEvent: React.FC<Props> = (props) => {
	const {
		eid,
		event,
		sessions,
		roles,
		isOrganizer,
		isOrganizerLoading,
		isSessionsLoading,
		sessionsError,
		isOrganizerError,
		attendee
	} = props;

	if (!event) return null;

	return (
		<div>
			{isOrganizer && (
				<Link href={`/events/${eid}/admin`}>
					<a className="block text-white bg-primary-400 px-5 py-3 rounded-md mb-4 font-semibold">
						You are an organizer for this event, click here to manage this event
					</a>
				</Link>
			)}

			{!Boolean(attendee) && (
				<Link href={`/events/${eid}/register`}>
					<a className="block text-white bg-primary-400 px-5 py-3 rounded-md mb-4 font-semibold">
						Are you attending this event? Register here.
					</a>
				</Link>
			)}

			<div className="flex flex-row items-center mb-3">
				<div className="relative w-12 h-12 md:w-20 md:h-20 rounded-md mr-3 md:mr-5 border-2 border-gray-100">
					<Image
						alt={event.name}
						src={
							event.image
								? `https://cdn.evental.app${event.image}`
								: `https://cdn.evental.app/images/default-event.jpg`
						}
						layout="fill"
						className="rounded-md"
					/>
				</div>

				<div>
					<span className="text-gray-600 text-sm block">{event?.type}</span>
					<h1 className="text-3xl font-bold">{event?.name}</h1>
					<div className="flex flex-row items-center mb-1">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mr-1.5"
							size="1x"
							icon={faLocationDot}
						/>
						<p>{event?.location}</p>
					</div>

					<div className="flex flex-row items-center">
						<FontAwesomeIcon
							fill="currentColor"
							className="w-5 h-5 mr-1.5"
							size="1x"
							icon={faCalendarDay}
						/>
						<p>
							{format(new Date(event.startDate), 'MMMM dd')} -{' '}
							{format(new Date(event.endDate), 'MMMM dd')}
						</p>
					</div>
				</div>
			</div>
			<p>{event?.description}</p>

			<div className="overflow-auto whitespace-nowrap relative py-2 mt-6">
				<Link href={`/events/${eid}/venues`} passHref>
					<LinkButton variant="inversePrimary">Venues</LinkButton>
				</Link>
				{roles &&
					roles.map((role) => (
						<Link href={`/events/${eid}/roles/${role.slug}`} passHref key={role.id}>
							<LinkButton className="ml-3" variant="inversePrimary">
								{capitalizeFirstLetter(role.name.toLowerCase())}s
							</LinkButton>
						</Link>
					))}
			</div>

			<SessionList
				isOrganizer={isOrganizer}
				isOrganizerLoading={isOrganizerLoading}
				isOrganizerError={isOrganizerError}
				sessions={sessions}
				eid={String(eid)}
				sessionsError={sessionsError}
				isSessionsLoading={isSessionsLoading}
			/>
		</div>
	);
};
