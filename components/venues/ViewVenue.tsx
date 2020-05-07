import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { SessionList } from '../sessions/SessionList';
import React from 'react';
import Prisma from '@prisma/client';
import { UseSessionsByVenueQuery } from '../../hooks/queries/useSessionsByVenueQuery';

type Props = {
	venue: Prisma.EventVenue;
	sessionsByVenueQuery: UseSessionsByVenueQuery;
	eid: string;
	admin?: boolean;
};

export const ViewVenue: React.FC<Props> = (props) => {
	const { venue, sessionsByVenueQuery, eid, admin = false } = props;

	return (
		<div>
			{venue.address && (
				<div className="flex flex-row items-center mb-1">
					<FontAwesomeIcon
						fill="currentColor"
						className="w-5 h-5 mr-1.5"
						size="1x"
						icon={faLocationDot}
					/>
					<p>{venue.address}</p>
				</div>
			)}

			<p>{venue.description}</p>

			{sessionsByVenueQuery.data && (
				<SessionList eid={String(eid)} sessions={sessionsByVenueQuery.data} admin={admin} />
			)}
		</div>
	);
};
