import { faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import parse from 'html-react-parser';
import React from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import Tooltip from '../radix/components/Tooltip';
import { SessionList } from '../sessions/SessionList';

type Props = {
	eid: string;
	vid: string;
	admin?: boolean;
	venue: Prisma.EventVenue;
	sessions: SessionWithVenue[];
	event: Prisma.Event;
	user: PasswordlessUser | undefined;
};

export const ViewVenue: React.FC<Props> = (props) => {
	const { eid, vid, venue, admin = false, sessions, event, user } = props;

	if (!venue) return null;

	return (
		<div>
			<div className="mb-5">
				<FlexRowBetween className="mb-1">
					<h3 className="text-xl font-medium md:text-2xl">{venue.name}</h3>

					{admin && (
						<div className="space-x-4">
							<IconLinkTooltip
								message="Click to edit this attendee"
								side="top"
								href={`/events/${eid}/admin/venues/${vid}/edit`}
								icon={faPenToSquare}
								className="text-gray-700"
							/>
							<IconLinkTooltip
								message="Click to delete this attendee"
								side="top"
								href={`/events/${eid}/admin/venues/${vid}/delete`}
								icon={faTrashCan}
								className="text-red-500"
							/>
						</div>
					)}
				</FlexRowBetween>
				<Tooltip
					message={
						venue.address
							? `This is venue is located at ${venue?.address}.`
							: 'This venue has not specified an address'
					}
				>
					<div className="mb-1 inline-flex cursor-help flex-row items-center">
						<FontAwesomeIcon
							fill="currentColor"
							className="mr-1.5 h-5 w-5"
							size="1x"
							icon={faLocationDot}
						/>
						{venue.address ? <p>{venue.address}</p> : <em>No Address</em>}
					</div>
				</Tooltip>
				{venue.description && (
					<div className="prose mt-1 focus:outline-none prose-a:text-primary">
						{parse(String(venue.description))}
					</div>
				)}
			</div>

			<h3 className="mb-3 text-xl font-medium md:text-2xl">
				Sessions <span className="font-normal text-gray-500">({sessions.length || 0})</span>
			</h3>

			<SessionList eid={String(eid)} sessions={sessions} event={event} user={user} admin />
		</div>
	);
};
