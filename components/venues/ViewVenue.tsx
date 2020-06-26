import { faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Prisma from '@prisma/client';
import parse from 'html-react-parser';
import React from 'react';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { IconLinkTooltip } from '../IconLinkTooltip';
import { TooltipIcon } from '../TooltipIcon';
import { SessionList } from '../sessions/SessionList';
import { Heading } from '../typography/Heading';

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
			<div className="mb-3">
				<div className="mb-1 flex flex-row justify-between items-center">
					<Heading>{venue.name}</Heading>

					{admin && (
						<div className="space-x-4">
							<IconLinkTooltip
								message="Click to edit this attendee"
								side="top"
								href={`/events/${eid}/admin/venues/${vid}/edit`}
								icon={faPenToSquare}
								className="text-gray-700 hover:text-gray-600"
							/>
							<IconLinkTooltip
								message="Click to delete this attendee"
								side="top"
								href={`/events/${eid}/admin/venues/${vid}/delete`}
								icon={faTrashCan}
								className="text-red-500 hover:text-red-400"
							/>
						</div>
					)}
				</div>

				<div className="flex flex-row flex-wrap items-center text-gray-600">
					<TooltipIcon
						icon={faLocationDot}
						tooltipMessage={
							venue.address
								? `This is venue is located at ${venue?.address}.`
								: 'This venue has not specified an address'
						}
						labelComponent={venue.address ? <p>{venue.address}</p> : <em>No Address</em>}
					/>
				</div>

				{venue.description && (
					<div className="prose mt-1 focus:outline-none prose-a:text-primary">
						{parse(String(venue.description))}
					</div>
				)}
			</div>

			<SessionList eid={String(eid)} sessions={sessions} event={event} user={user} admin />
		</div>
	);
};
