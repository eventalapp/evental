import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

type Props = {
	eid: string;
	vid: string;
} & UseOrganizerQueryData &
	UseVenueQueryData;

export const ViewVenue: React.FC<Props> = (props) => {
	const { eid, vid, venue, isOrganizer, isOrganizerLoading } = props;

	if (!venue) return null;

	return (
		<div>
			<div>
				<FlexRowBetween>
					<h1 className="text-3xl">{venue.name}</h1>

					<div>
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/venues/${vid}/edit`} passHref>
								<LinkButton className="mr-3">Edit venue</LinkButton>
							</Link>
						)}
						{!isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/venues/${vid}/delete`} passHref>
								<LinkButton className="mr-3">Delete venue</LinkButton>
							</Link>
						)}
					</div>
				</FlexRowBetween>

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
			</div>
		</div>
	);
};
