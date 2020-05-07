import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClipboardList, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { AttendeeList } from '../attendees/AttendeeList';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import Tooltip from '../radix/components/Tooltip';

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
				<div className="flex items-center">
					{session?.type && (
						<div
							className="rounded-full mr-3 w-4 h-4"
							style={{ backgroundColor: session?.type?.color }}
						/>
					)}

					<h1 className="text-2xl md:text-3xl font-bold">{session.name}</h1>
				</div>
				<div>
					{!isAttending && !admin && (
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

			{session?.type?.name && (
				<div className="block">
					<Link
						href={`/events/${eid}${admin ? '/admin' : ''}/sessions/types/${session?.type?.slug}`}
					>
						<a>
							<Tooltip message={`This session is a ${session?.type?.name} session.`}>
								<div className="inline-flex flex-row items-center mb-1">
									<FontAwesomeIcon
										fill="currentColor"
										className="w-5 h-5 mr-1.5"
										size="1x"
										icon={faClipboardList}
									/>
									<p>{session?.type?.name}</p>
								</div>
							</Tooltip>
						</a>
					</Link>
				</div>
			)}

			{session?.venue?.name && (
				<div className="block">
					<Link href={`/events/${eid}/venues/${session?.venue?.slug}`}>
						<a>
							<Tooltip
								message={`This session is taking place at the ${session?.venue?.name} venue.`}
							>
								<div className="inline-flex flex-row items-center mb-1">
									<FontAwesomeIcon
										fill="currentColor"
										className="w-5 h-5 mr-1.5"
										size="1x"
										icon={faLocationDot}
									/>
									<p>{session?.venue?.name}</p>
								</div>
							</Tooltip>
						</a>
					</Link>
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
