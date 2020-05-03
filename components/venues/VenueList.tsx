import Link from 'next/link';
import React from 'react';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { NotFound } from '../error/NotFound';

type Props = {
	eid: string;
} & UseVenuesQueryData;

export const VenueList: React.FC<Props> = (props) => {
	const { eid, venues } = props;

	if (venues && venues.length === 0) {
		return <NotFound message="No venues found." />;
	}

	if (!venues) return null;

	return (
		<div>
			{venues.map((venue) => (
				<Link href={`/events/${eid}/venues/${venue.slug}`} key={venue.id} passHref>
					<a>
						<div className="p-3 mb-3 bg-gray-75 rounded-md">
							<div className="flex flex-row justify-between items-center flex-wrap">
								<span className="text-lg block font-medium">
									{venue.name}
									<span className="text-base font-normal text-gray-500"> - {venue.address}</span>
								</span>
							</div>
						</div>
					</a>
				</Link>
			))}
		</div>
	);
};
