import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { ViewServerError } from '../ViewServerError';
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
		return <ViewServerError errors={[isOrganizerError, venuesError]} />;
	}

	if (!venues || (venues && venues.length === 0)) {
		return <NotFound />;
	}

	return (
		<div>
			{venues.map((venue) => (
				<div key={venue.id} className="border-t-2 border-gray-200">
					<div className="flex flex-row justify-between items-center flex-wrap pt-3">
						<div className="pb-3">
							<span className="text-lg block">{venue.name}</span>
							<span className="text-md block">{venue.description}</span>
						</div>
						<div className="pb-3">
							<Link href={`/events/${eid}/venues/${venue.slug}`} passHref>
								<LinkButton variant={'primary'}>View</LinkButton>
							</Link>
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/venues/${venue.slug}/edit`} passHref>
									<LinkButton variant={'primary'} className="ml-3">
										Edit
									</LinkButton>
								</Link>
							)}
							{!isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/venues/${venue.slug}/delete`} passHref>
									<LinkButton variant={'primary'} className="ml-3">
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
