import { faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import * as Prisma from '@prisma/client';
import parse from 'html-react-parser';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { SessionWithVenue, StrippedUser } from '@eventalapp/shared/utils';

import { Heading } from '../primitives/Heading';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { IconLinkTooltip } from '../primitives/IconLinkTooltip';
import { TooltipIcon, TooltipIconSkeleton } from '../primitives/TooltipIcon';
import { SessionList } from '../sessions/SessionList';
import DeleteVenueDialog from './DeleteVenueDialog';

type Props = {
	eid: string;
	vid: string;
	admin?: boolean;
	venue?: Prisma.EventVenue;
	sessions?: SessionWithVenue[];
	event?: Prisma.Event;
	user?: StrippedUser | undefined;
};

export const ViewVenue: React.FC<Props> = (props) => {
	const { eid, vid, venue, admin = false, sessions, event } = props;

	return (
		<div>
			<div className="mb-4">
				<div className="mb-1 flex flex-row items-center justify-between">
					<Heading>{venue ? venue.name : <Skeleton className="w-48" />}</Heading>

					{venue && admin && (
						<div className="flex flex-row space-x-4">
							<IconLinkTooltip
								message="Edit this venue"
								href={`/events/${eid}/admin/venues/${vid}/edit`}
								icon={faPenToSquare}
								color="gray"
							/>

							<DeleteVenueDialog eid={String(eid)} vid={String(vid)}>
								<IconButtonTooltip icon={faTrashCan} message="Delete this venue" color="red" />
							</DeleteVenueDialog>
						</div>
					)}
				</div>

				<div className="flex flex-row flex-wrap items-center text-gray-600">
					{venue ? (
						<TooltipIcon
							icon={faLocationDot}
							tooltipMessage={
								venue.address
									? `This is venue is located at ${venue?.address}.`
									: 'This venue has not specified an address'
							}
							labelComponent={venue.address ? <p>{venue.address}</p> : <em>No Address</em>}
						/>
					) : (
						<TooltipIconSkeleton />
					)}
				</div>

				{venue ? (
					venue.description && (
						<div className="prose mt-1 focus:outline-none prose-a:text-primary">
							{parse(String(venue.description))}
						</div>
					)
				) : (
					<div className="mt-3">
						<Skeleton className="w-full" count={3} />
					</div>
				)}
			</div>

			<SessionList sessions={sessions} event={event} admin={admin} />
		</div>
	);
};
