import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import React from 'react';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { UseSessionAttendeeQueryData } from '../../hooks/queries/useSessionAttendeeQuery';
import { AttendeeList } from '../attendees/AttendeeList';
import { UseSessionAttendeesQueryData } from '../../hooks/queries/useSessionAttendeesQuery';

type Props = {
	eid: string;
	sid: string;
} & UseSessionQueryData &
	UseOrganizerQueryData &
	UseSessionAttendeeQueryData &
	UseSessionAttendeesQueryData;

export const ViewSession: React.FC<Props> = (props) => {
	const {
		session,
		isOrganizerLoading,
		isOrganizer,
		sid,
		eid,
		sessionAttendeeQuery,
		sessionAttendeesQuery
	} = props;

	if (!session) return null;

	return (
		<div>
			<FlexRowBetween>
				<h1 className="text-3xl font-bold">{session.name}</h1>

				<div>
					{!sessionAttendeeQuery.data && (
						<Link href={`/events/${eid}/sessions/${sid}/register`}>
							<LinkButton>Attend This Session</LinkButton>
						</Link>
					)}
					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/edit`} passHref>
							<LinkButton className="ml-3">Edit session</LinkButton>
						</Link>
					)}
					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/delete`} passHref>
							<LinkButton className="ml-3">Delete session</LinkButton>
						</Link>
					)}
				</div>
			</FlexRowBetween>

			{session?.venue?.name && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faLocationDot}
					/>
					<p>{session?.venue?.name}</p>
				</div>
			)}

			<div className="flex flex-row items-center">
				<FontAwesomeIcon
					fill="currentColor"
					className="w-5 h-5 mr-1.5"
					size="1x"
					icon={faCalendarDay}
				/>
				<p>
					{format(new Date(session.startDate), 'MMMM dd h:mm a')} -{' '}
					{format(new Date(session.endDate), 'MMMM dd h:mm a')}
				</p>
			</div>

			<p>{session.description}</p>

			<h3 className="text-2xl font-bold mt-3">Attendees</h3>
			{sessionAttendeesQuery && sessionAttendeesQuery.data && (
				<AttendeeList eid={eid} attendees={sessionAttendeesQuery.data} />
			)}
		</div>
	);
};
