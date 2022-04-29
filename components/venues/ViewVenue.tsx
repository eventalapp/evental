import React from 'react';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { ViewServerError } from '../ViewServerError';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import PageWrapper from '../layout/PageWrapper';

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
		return <ViewServerError errors={[isOrganizerError, venueError]} />;
	}

	if (!venue) {
		return <NotFound />;
	}

	return (
		<div>
			<div>
				<FlexRowBetween>
					<h1 className="text-3xl mb-3">{venue.name}</h1>

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

				<p>{venue.description}</p>
			</div>
		</div>
	);
};
