import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../Form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { ServerError } from '../ServerError';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
} & UseOrganizerQueryData &
	UseVenuesQueryData;

export const VenueList: React.FC<Props> = (props) => {
	const {
		eid,
		venues,
		isOrganizer,
		isOrganizerLoading,
		isOrganizerError,
		isVenuesLoading,
		venuesError
	} = props;

	if (isVenuesLoading || isOrganizerLoading) {
		return <Loading />;
	}

	if (isOrganizerError || venuesError) {
		return <ServerError errors={[isOrganizerError, venuesError]} />;
	}

	if (!venues || (venues && venues.length === 0)) {
		return <NotFound />;
	}

	return (
		<div>
			{venues.map((venue) => (
				<div key={venue.id} className="py-2 border-t-2 border-gray-200">
					<div className="flex flex-row justify-between items-center">
						<div>
							<span className="text-lg block">{venue.name}</span>
							<span className="text-md block">{venue.description}</span>
						</div>
						<div>
							<Link href={`/events/${eid}/venues/${venue.slug}`} passHref>
								<LinkButton variant={'secondary'}>View</LinkButton>
							</Link>
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/venues/${venue.slug}/edit`} passHref>
									<LinkButton variant={'secondary'} className="ml-3">
										Edit
									</LinkButton>
								</Link>
							)}
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/venues/${venue.slug}/delete`} passHref>
									<LinkButton variant={'secondary'} className="ml-3">
										Delete
									</LinkButton>
								</Link>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
