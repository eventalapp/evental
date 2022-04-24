import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../Form/LinkButton';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { ServerError } from '../ServerError';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
	vid: string;
} & UseOrganizerQueryData &
	UseVenueQueryData;

export const ViewVenue: React.FC<Props> = (props) => {
	const {
		eid,
		vid,
		venue,
		venueError,
		isOrganizerError,
		isOrganizer,
		isVenueLoading,
		isOrganizerLoading
	} = props;

	if (isVenueLoading || isOrganizerLoading) {
		return <Loading />;
	}

	if (isOrganizerError || venueError) {
		return <ServerError errors={[isOrganizerError, venueError]} />;
	}

	if (!venue) {
		return <NotFound />;
	}

	return (
		<div>
			<div>
				<div className="flex flex-row justify-between">
					<h1 className="text-3xl">{venue.name}</h1>

					{!isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/venues/${vid}/edit`} passHref>
							<LinkButton className="mr-3">Edit venue</LinkButton>
						</Link>
					)}
				</div>

				<p>{venue.description}</p>
			</div>
		</div>
	);
};
