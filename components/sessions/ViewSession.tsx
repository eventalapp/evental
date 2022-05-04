import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { AttendeeList } from '../attendees/AttendeeList';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

type Props = {
	eid: string;
	sid: string;
	isAttending: boolean;
	attendees: AttendeeWithUser[] | undefined;
	session: SessionWithVenue;
	admin?: boolean;
};

export const ViewSession: React.FC<Props> = (props) => {
	const { session, sid, eid, isAttending, admin = false, attendees } = props;

	if (!session) return null;

	return (
		<div>
			<FlexRowBetween>
				<h1 className="text-3xl font-bold">{session.name}</h1>

				<div>
					{!isAttending && (
						<Link href={`/events/${eid}/sessions/${sid}/register`} passHref>
							<LinkButton>Attend This Session</LinkButton>
						</Link>
					)}
					{admin && (
						<Link href={`/events/${eid}/admin/sessions/${sid}/edit`} passHref>
							<LinkButton className="ml-3">Edit session</LinkButton>
						</Link>
					)}
					{admin && (
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

			<h3 className="text-2xl font-medium my-3">Attendees ({attendees?.length || 0})</h3>

			{attendees && <AttendeeList admin={admin} eid={eid} attendees={attendees} />}
		</div>
	);
};
